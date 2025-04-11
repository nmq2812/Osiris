package backend.osiris.service.inventory;

import backend.osiris.dto.inventory.DocketReasonRequest;
import backend.osiris.dto.inventory.DocketReasonResponse;
import backend.osiris.service.CrudService;

public interface DocketReasonService extends CrudService<Long, DocketReasonRequest, DocketReasonResponse> {}