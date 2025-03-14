package backend.osiris.service.customer;

import backend.osiris.dto.customer.CustomerStatusRequest;
import backend.osiris.dto.customer.CustomerStatusResponse;
import backend.osiris.service.CrudService;

public interface CustomerStatusService extends CrudService<Long, CustomerStatusRequest, CustomerStatusResponse> {}