package backend.osiris.service.product;

import backend.osiris.dto.product.CategoryRequest;
import backend.osiris.dto.product.CategoryResponse;
import backend.osiris.service.CrudService;

public interface CategoryService extends CrudService<Long, CategoryRequest, CategoryResponse> {}