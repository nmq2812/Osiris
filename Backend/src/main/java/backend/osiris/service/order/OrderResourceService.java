package backend.osiris.service.order;

import backend.osiris.dto.order.OrderResourceRequest;
import backend.osiris.dto.order.OrderResourceResponse;
import backend.osiris.service.CrudService;

public interface OrderResourceService extends CrudService<Long, OrderResourceRequest, OrderResourceResponse> {}