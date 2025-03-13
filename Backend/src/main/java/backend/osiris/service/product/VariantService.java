package backend.osiris.service.product;

import backend.osiris.dto.product.VariantRequest;
import backend.osiris.dto.product.VariantResponse;
import backend.osiris.service.CrudService;

public interface VariantService extends CrudService<Long, VariantRequest, VariantResponse> {}