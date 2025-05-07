package backend.osiris.service.address;

import backend.osiris.dto.address.AddressRequest;
import backend.osiris.dto.address.AddressResponse;
import backend.osiris.service.CrudService;

public interface AddressService extends CrudService<Long, AddressRequest, AddressResponse> {}