package backend.osiris.service.cashbook;

import backend.osiris.dto.cashbook.PaymentMethodRequest;
import backend.osiris.dto.cashbook.PaymentMethodResponse;
import backend.osiris.service.CrudService;

public interface PaymentMethodService extends CrudService<Long, PaymentMethodRequest, PaymentMethodResponse> {}