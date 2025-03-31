package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.PurchaseOrderVariantRequest;
import backend.osiris.dto.inventory.PurchaseOrderVariantResponse;
import backend.osiris.entity.inventory.PurchaseOrderVariantKey;
import backend.osiris.service.CrudService;

public interface PurchaseOrderVariantService extends CrudService<PurchaseOrderVariantKey, PurchaseOrderVariantRequest,
        PurchaseOrderVariantResponse> {}
