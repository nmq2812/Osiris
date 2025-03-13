package backend.osiris.service.product;

import backend.osiris.dto.product.PropertyRequest;
import backend.osiris.dto.product.PropertyResponse;
import backend.osiris.service.CrudService;

public interface PropertyService extends CrudService<Long, PropertyRequest, PropertyResponse> {}