package backend.osiris.service.customer;

import backend.osiris.dto.customer.CustomerResourceRequest;
import backend.osiris.dto.customer.CustomerResourceResponse;
import backend.osiris.service.CrudService;

public interface CustomerResourceService extends CrudService<Long, CustomerResourceRequest, CustomerResourceResponse> {}