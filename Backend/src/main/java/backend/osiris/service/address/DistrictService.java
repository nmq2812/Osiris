package backend.osiris.service.address;

import backend.osiris.dto.address.DistrictRequest;
import backend.osiris.dto.address.DistrictResponse;
import backend.osiris.service.CrudService;

public interface DistrictService extends CrudService<Long, DistrictRequest, DistrictResponse> {}