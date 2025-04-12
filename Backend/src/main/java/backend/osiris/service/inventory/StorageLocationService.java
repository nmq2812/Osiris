package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.StorageLocationRequest;
import backend.osiris.dto.inventory.StorageLocationResponse;
import backend.osiris.service.CrudService;

public interface StorageLocationService extends CrudService<Long, StorageLocationRequest, StorageLocationResponse> {}