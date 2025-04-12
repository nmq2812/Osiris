package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.TransferRequest;
import backend.osiris.dto.inventory.TransferResponse;
import backend.osiris.service.CrudService;

public interface TransferService extends CrudService<Long, TransferRequest, TransferResponse> {}