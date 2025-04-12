package backend.osiris.service.order;

import backend.osiris.dto.order.OrderCancellationReasonRequest;
import backend.osiris.dto.order.OrderCancellationReasonResponse;
import backend.osiris.service.CrudService;

public interface OrderCancellationReasonService extends CrudService<Long, OrderCancellationReasonRequest, OrderCancellationReasonResponse> {}