package backend.osiris.service.address;

import backend.osiris.dto.address.WardRequest;
import backend.osiris.dto.address.WardResponse;
import backend.osiris.service.CrudService;

public interface WardService extends CrudService<Long, WardRequest, WardResponse> {
}
