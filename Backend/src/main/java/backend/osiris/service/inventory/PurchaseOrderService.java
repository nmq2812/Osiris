package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.PurchaseOrderRequest;
import backend.osiris.dto.inventory.PurchaseOrderResponse;
import backend.osiris.service.CrudService;

public interface PurchaseOrderService extends CrudService<Long, PurchaseOrderRequest, PurchaseOrderResponse> {}