package backend.osiris.dto.cashbook;

import backend.osiris.entity.cashbook.PaymentMethodType;
import lombok.Data;

@Data
public class ClientPaymentMethodResponse {
    private Long paymentMethodId;
    private String paymentMethodName;
    private PaymentMethodType paymentMethodCode;
}