package backend.osiris.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaypalCheckoutResponse {
    private String paypalUrl;
}
