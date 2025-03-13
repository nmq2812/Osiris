package backend.osiris.service.product;

import backend.osiris.dto.product.UnitRequest;
import backend.osiris.dto.product.UnitResponse;
import backend.osiris.service.CrudService;

public interface UnitService extends CrudService<Long, UnitRequest, UnitResponse> {}