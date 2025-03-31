package backend.osiris.service.inventory;

import backend.osiris.dto.order.OrderVariantRequest;
import backend.osiris.dto.order.OrderVariantResponse;
import backend.osiris.entity.order.OrderVariantKey;
import backend.osiris.service.CrudService;

public interface OrderVariantService extends CrudService<OrderVariantKey, OrderVariantRequest, OrderVariantResponse> {}
