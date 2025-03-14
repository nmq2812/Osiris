package backend.osiris.service.customer;

import backend.osiris.dto.customer.CustomerRequest;
import backend.osiris.dto.customer.CustomerResponse;
import backend.osiris.service.CrudService;

public interface CustomerService extends CrudService<Long, CustomerRequest, CustomerResponse> {}