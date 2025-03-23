package backend.osiris.service.order;

import backend.osiris.dto.client.ClientConfirmedOrderResponse;
import backend.osiris.dto.client.ClientSimpleOrderRequest;

public interface OrderService {

    void cancelOrder(String code);

    ClientConfirmedOrderResponse createClientOrder(ClientSimpleOrderRequest request);

    void captureTransactionPaypal(String paypalOrderId, String payerId);

}
