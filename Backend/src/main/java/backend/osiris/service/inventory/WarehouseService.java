package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.WarehouseRequest;
import backend.osiris.dto.inventory.WarehouseResponse;
import backend.osiris.service.CrudService;

public interface WarehouseService extends CrudService<Long, WarehouseRequest, WarehouseResponse> {}