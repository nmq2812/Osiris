package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.DocketRequest;
import backend.osiris.dto.inventory.DocketResponse;
import backend.osiris.service.CrudService;

public interface DocketService extends CrudService<Long, DocketRequest, DocketResponse> {}
