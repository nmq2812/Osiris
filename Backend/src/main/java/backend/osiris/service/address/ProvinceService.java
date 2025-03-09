package backend.osiris.service.address;

import backend.osiris.dto.address.ProvinceRequest;
import backend.osiris.dto.address.ProvinceResponse;
import backend.osiris.service.CrudService;

public interface ProvinceService extends CrudService<Long, ProvinceRequest, ProvinceResponse> {}