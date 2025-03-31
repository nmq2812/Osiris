package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.CountVariantRequest;
import backend.osiris.dto.inventory.CountVariantResponse;
import backend.osiris.entity.inventory.CountVariantKey;
import backend.osiris.service.CrudService;

public interface CountVariantService extends CrudService<CountVariantKey, CountVariantRequest, CountVariantResponse> {}
