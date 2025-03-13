package backend.osiris.service.product;

import backend.osiris.dto.product.GuaranteeRequest;
import backend.osiris.dto.product.GuaranteeResponse;
import backend.osiris.service.CrudService;

public interface GuaranteeService extends CrudService<Long, GuaranteeRequest, GuaranteeResponse> {}