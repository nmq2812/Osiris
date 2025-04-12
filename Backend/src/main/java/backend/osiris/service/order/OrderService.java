package backend.osiris.service.order;

import backend.osiris.dto.client.ClientConfirmedOrderResponse;
import backend.osiris.dto.client.ClientSimpleOrderRequest;
import backend.osiris.dto.order.OrderRequest;
import backend.osiris.dto.order.OrderResponse;
import backend.osiris.service.CrudService;

public interface OrderService extends CrudService<Long, OrderRequest, OrderResponse> {

    void cancelOrder(String code);

    ClientConfirmedOrderResponse createClientOrder(ClientSimpleOrderRequest request);

    void captureTransactionPaypal(String paypalOrderId, String payerId);

}
