package backend.osiris.service.product;

import backend.osiris.dto.product.BrandRequest;
import backend.osiris.dto.product.BrandResponse;
import backend.osiris.service.CrudService;

public interface BrandService extends CrudService<Long, BrandRequest, BrandResponse> {}