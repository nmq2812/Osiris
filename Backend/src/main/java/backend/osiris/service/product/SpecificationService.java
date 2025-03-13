package backend.osiris.service.product;

import backend.osiris.dto.product.SpecificationRequest;
import backend.osiris.dto.product.SpecificationResponse;
import backend.osiris.service.CrudService;

public interface SpecificationService extends CrudService<Long, SpecificationRequest, SpecificationResponse> {}