package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.DestinationRequest;
import backend.osiris.dto.inventory.DestinationResponse;
import backend.osiris.service.CrudService;

public interface DestinationService extends CrudService<Long, DestinationRequest, DestinationResponse> {}