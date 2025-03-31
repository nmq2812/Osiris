package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.DocketVariantRequest;
import backend.osiris.dto.inventory.DocketVariantResponse;
import backend.osiris.entity.inventory.DocketVariantKey;
import backend.osiris.service.CrudService;

public interface DocketVariantService extends CrudService<DocketVariantKey, DocketVariantRequest, DocketVariantResponse> {}
