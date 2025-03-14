package backend.osiris.dto.client;

import backend.osiris.entity.cashbook.PaymentMethodType;
import lombok.Data;

@Data
public class ClientSimpleOrderRequest {
    private PaymentMethodType paymentMethodType;
}