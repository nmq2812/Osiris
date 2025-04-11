package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.VariantInventoryLimitRequest;
import backend.osiris.dto.inventory.VariantInventoryLimitResponse;
import backend.osiris.service.CrudService;

public interface VariantInventoryLimitService extends CrudService<Long, VariantInventoryLimitRequest, VariantInventoryLimitResponse> {}