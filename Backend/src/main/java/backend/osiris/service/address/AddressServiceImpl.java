package backend.osiris.service.address;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.address.AddressRequest;
import backend.osiris.dto.address.AddressResponse;
import backend.osiris.mapper.address.AddressMapper;
import backend.osiris.repository.address.AddressRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AddressServiceImpl implements AddressService {

    private AddressRepository addressRepository;

    private AddressMapper addressMapper;

    @Override
    public ListResponse<AddressResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.ADDRESS, addressRepository, addressMapper);
    }

    @Override
    public AddressResponse findById(Long id) {
        return defaultFindById(id, addressRepository, addressMapper, ResourceName.ADDRESS);
    }

    @Override
    public AddressResponse save(AddressRequest request) {
        return defaultSave(request, addressRepository, addressMapper);
    }

    @Override
    public AddressResponse save(Long id, AddressRequest request) {
        return defaultSave(id, request, addressRepository, addressMapper, ResourceName.ADDRESS);
    }

    @Override
    public void delete(Long id) {
        addressRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        addressRepository.deleteAllById(ids);
    }

}