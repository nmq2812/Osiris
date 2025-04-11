package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.CountRequest;
import backend.osiris.dto.inventory.CountResponse;
import backend.osiris.service.CrudService;

public interface CountService extends CrudService<Long, CountRequest, CountResponse> {}