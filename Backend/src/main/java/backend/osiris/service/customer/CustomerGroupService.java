package backend.osiris.service.customer;

import backend.osiris.dto.customer.CustomerGroupRequest;
import backend.osiris.dto.customer.CustomerGroupResponse;
import backend.osiris.service.CrudService;

public interface CustomerGroupService extends CrudService<Long, CustomerGroupRequest, CustomerGroupResponse> {}