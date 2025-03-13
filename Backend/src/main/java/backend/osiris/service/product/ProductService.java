package backend.osiris.service.product;

import backend.osiris.dto.product.ProductRequest;
import backend.osiris.dto.product.ProductResponse;
import backend.osiris.service.CrudService;

public interface ProductService extends CrudService<Long, ProductRequest, ProductResponse> {}