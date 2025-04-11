package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.ProductInventoryLimitRequest;
import backend.osiris.dto.inventory.ProductInventoryLimitResponse;
import backend.osiris.service.CrudService;

public interface ProductInventoryLimitService extends CrudService<Long, ProductInventoryLimitRequest, ProductInventoryLimitResponse> {}