package backend.osiris.service.order;

import backend.osiris.config.payment.paypal.PayPalHttpClient;
import backend.osiris.constant.AppConstants;
import backend.osiris.constant.FieldName;
import backend.osiris.constant.ResourceName;
import backend.osiris.dto.client.ClientConfirmedOrderResponse;
import backend.osiris.dto.client.ClientSimpleOrderRequest;
import backend.osiris.dto.payment.OrderIntent;
import backend.osiris.dto.payment.OrderStatus;
import backend.osiris.dto.payment.PaymentLandingPage;
import backend.osiris.dto.payment.PaypalRequest;
import backend.osiris.dto.payment.PaypalResponse;
import backend.osiris.dto.waybill.GhnCancelOrderRequest;
import backend.osiris.dto.waybill.GhnCancelOrderResponse;
import backend.osiris.entity.authentication.User;
import backend.osiris.entity.cart.Cart;
import backend.osiris.entity.cashbook.PaymentMethodType;
import backend.osiris.entity.general.Notification;
import backend.osiris.entity.general.NotificationType;
import backend.osiris.entity.order.Order;
import backend.osiris.entity.order.OrderResource;
import backend.osiris.entity.order.OrderVariant;
import backend.osiris.entity.promotion.Promotion;
import backend.osiris.entity.waybill.Waybill;
import backend.osiris.entity.waybill.WaybillLog;
import backend.osiris.exception.ResourceNotFoundException;
import backend.osiris.mapper.client.ClientOrderMapper;
import backend.osiris.mapper.general.NotificationMapper;
import backend.osiris.repository.authentication.UserRepository;
import backend.osiris.repository.cart.CartRepository;
import backend.osiris.repository.general.NotificationRepository;
import backend.osiris.repository.order.OrderRepository;
import backend.osiris.repository.promotion.PromotionRepository;
import backend.osiris.repository.waybill.WaybillLogRepository;
import backend.osiris.repository.waybill.WaybillRepository;
import backend.osiris.service.general.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderServiceImpl implements OrderService {

    @Value("${osiris.app.shipping.ghnToken}")
    private String ghnToken;
    @Value("${osiris.app.shipping.ghnShopId}")
    private String ghnShopId;
    @Value("${osiris.app.shipping.ghnApiPath}")
    private String ghnApiPath;

    private final OrderRepository orderRepository;
    private final WaybillRepository waybillRepository;
    private final WaybillLogRepository waybillLogRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PromotionRepository promotionRepository;

    private final PayPalHttpClient payPalHttpClient;
    private final ClientOrderMapper clientOrderMapper;

    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    private static final int USD_VND_RATE = 23_000;

    @Override
    public void cancelOrder(String code) {
        Order order = orderRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceName.ORDER, FieldName.ORDER_CODE, code));

        // Hủy đơn hàng khi status = 1 hoặc 2
        if (order.getStatus() < 3) {
            order.setStatus(5); // Status 5 là trạng thái Hủy
            orderRepository.save(order);

            Waybill waybill = waybillRepository.findByOrderId(order.getId()).orElse(null);

            // Status 1 là Vận đơn đang chờ lấy hàng
            if (waybill != null && waybill.getStatus() == 1) {
                String cancelOrderApiPath = ghnApiPath + "/switch-status/cancel";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.add("Token", ghnToken);
                headers.add("ShopId", ghnShopId);

                RestTemplate restTemplate = new RestTemplate();

                var request = new HttpEntity<>(new GhnCancelOrderRequest(List.of(waybill.getCode())), headers);
                var response = restTemplate.postForEntity(cancelOrderApiPath, request, GhnCancelOrderResponse.class);

                if (response.getStatusCode() != HttpStatus.OK) {
                    throw new RuntimeException("Error when calling Cancel Order GHN API");
                }

                // Integrated with GHN API
                if (response.getBody() != null) {
                    for (var data : response.getBody().getData()) {
                        if (data.getResult()) {
                            WaybillLog waybillLog = new WaybillLog();
                            waybillLog.setWaybill(waybill);
                            waybillLog.setPreviousStatus(waybill.getStatus()); // Status 1: Đang đợi lấy hàng
                            waybillLog.setCurrentStatus(4);
                            waybillLogRepository.save(waybillLog);

                            waybill.setStatus(4); // Status 4 là trạng thái Hủy
                            waybillRepository.save(waybill);
                        }
                    }
                }
            }
        } else {
            throw new RuntimeException(String
                    .format("Order with code %s is in delivery or has been cancelled. Please check again!", code));
        }
    }

    @Override
    public ClientConfirmedOrderResponse createClientOrder(ClientSimpleOrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));

        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceName.CART, FieldName.USERNAME, username));

        // (1) Tạo đơn hàng
        Order order = new Order();

        order.setCode(RandomString.make(12).toUpperCase());
        order.setStatus(1); // Status 1: Đơn hàng mới
        order.setToName(user.getFullname());
        order.setToPhone(user.getPhone());
        order.setToAddress(user.getAddress().getLine());
        order.setToWardName(user.getAddress().getWard().getName());
        order.setToDistrictName(user.getAddress().getDistrict().getName());
        order.setToProvinceName(user.getAddress().getProvince().getName());
        order.setOrderResource((OrderResource) new OrderResource().setId(1L)); // Default OrderResource
        order.setUser(user);

        order.setOrderVariants(cart.getCartVariants().stream()
                .map(cartVariant -> {
                    Promotion promotion = promotionRepository
                            .findActivePromotionByProductId(cartVariant.getVariant().getProduct().getId())
                            .stream()
                            .findFirst()
                            .orElse(null);

                    double currentPrice = calculateDiscountedPrice(cartVariant.getVariant().getPrice(),
                            promotion == null ? 0 : promotion.getPercent());

                    return new OrderVariant()
                            .setOrder(order)
                            .setVariant(cartVariant.getVariant())
                            .setPrice(BigDecimal.valueOf(currentPrice))
                            .setQuantity(cartVariant.getQuantity())
                            .setAmount(BigDecimal.valueOf(currentPrice).multiply(BigDecimal.valueOf(cartVariant.getQuantity())));
                })
                .collect(Collectors.toSet()));

        // Calculate price values
        // TODO: Vấn đề khuyến mãi
        BigDecimal totalAmount = BigDecimal.valueOf(order.getOrderVariants().stream()
                .mapToDouble(orderVariant -> orderVariant.getAmount().doubleValue())
                .sum());

        BigDecimal tax = BigDecimal.valueOf(AppConstants.DEFAULT_TAX);

        BigDecimal shippingCost = BigDecimal.ZERO;

        BigDecimal totalPay = totalAmount
                .add(totalAmount.multiply(tax).setScale(0, RoundingMode.HALF_UP))
                .add(shippingCost);

        order.setTotalAmount(totalAmount);
        order.setTax(tax);
        order.setShippingCost(shippingCost);
        order.setTotalPay(totalPay);
        order.setPaymentMethodType(request.getPaymentMethodType());
        order.setPaymentStatus(1); // Status 1: Chưa thanh toán

        // (2) Tạo response
        ClientConfirmedOrderResponse response = new ClientConfirmedOrderResponse();

        response.setOrderCode(order.getCode());
        response.setOrderPaymentMethodType(order.getPaymentMethodType());

        // (3) Kiểm tra hình thức thanh toán
        if (request.getPaymentMethodType() == PaymentMethodType.CASH) {
            orderRepository.save(order);
        } else if (request.getPaymentMethodType() == PaymentMethodType.PAYPAL) {
            try {
                // (3.2.1) Tính tổng tiền theo USD
                BigDecimal totalPayUSD = order.getTotalPay()
                        .divide(BigDecimal.valueOf(USD_VND_RATE), 0, RoundingMode.HALF_UP);

                // (3.2.2) Tạo một yêu cầu giao dịch PayPal
                PaypalRequest paypalRequest = new PaypalRequest();

                paypalRequest.setIntent(OrderIntent.CAPTURE);
                paypalRequest.setPurchaseUnits(List.of(
                        new PaypalRequest.PurchaseUnit(
                                new PaypalRequest.PurchaseUnit.Money("USD", totalPayUSD.toString())
                        )
                ));

                paypalRequest.setApplicationContext(new PaypalRequest.PayPalAppContext()
                        .setBrandName("Osiris")
                        .setLandingPage(PaymentLandingPage.BILLING)
                        .setReturnUrl(AppConstants.BACKEND_HOST + "/client-api/orders/success")
                        .setCancelUrl(AppConstants.BACKEND_HOST + "/client-api/orders/cancel"));

                PaypalResponse paypalResponse = payPalHttpClient.createPaypalTransaction(paypalRequest);

                // (3.2.3) Lưu order
                order.setPaypalOrderId(paypalResponse.getId());
                order.setPaypalOrderStatus(paypalResponse.getStatus().toString());

                orderRepository.save(order);

                // (3.2.4) Trả về đường dẫn checkout cho user
                for (PaypalResponse.Link link : paypalResponse.getLinks()) {
                    if ("approve".equals(link.getRel())) {
                        response.setOrderPaypalCheckoutLink(link.getHref());
                    }
                }
            } catch (Exception e) {
                throw new RuntimeException("Cannot create PayPal transaction request!" + e);
            }
        } else {
            throw new RuntimeException("Cannot identify payment method");
        }

        // (4) Vô hiệu cart
        cart.setStatus(2); // Status 2: Vô hiệu lực
        cartRepository.save(cart);

        return response;
    }

    @Override
    public void captureTransactionPaypal(String paypalOrderId, String payerId) {
        Order order = orderRepository.findByPaypalOrderId(paypalOrderId)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceName.ORDER, FieldName.PAYPAL_ORDER_ID, paypalOrderId));

        order.setPaypalOrderStatus(OrderStatus.APPROVED.toString());

        try {
            // (1) Capture
            payPalHttpClient.capturePaypalTransaction(paypalOrderId, payerId);

            // (2) Cập nhật order
            order.setPaypalOrderStatus(OrderStatus.COMPLETED.toString());
            order.setPaymentStatus(2); // Status 2: Đã thanh toán

            // (3) Gửi notification
            Notification notification = new Notification()
                    .setUser(order.getUser())
                    .setType(NotificationType.CHECKOUT_PAYPAL_SUCCESS)
                    .setMessage(String.format("Đơn hàng %s của bạn đã được thanh toán thành công bằng PayPal.", order.getCode()))
                    .setAnchor("/order/detail/" + order.getCode())
                    .setStatus(1);

            notificationRepository.save(notification);

            notificationService.pushNotification(order.getUser().getUsername(),
                    notificationMapper.entityToResponse(notification));
        } catch (Exception e) {
            log.error("Cannot capture transaction: {0}", e);
        }

        orderRepository.save(order);
    }

    private Double calculateDiscountedPrice(Double price, Integer discount) {
        return price * (100 - discount) / 100;
    }

}
