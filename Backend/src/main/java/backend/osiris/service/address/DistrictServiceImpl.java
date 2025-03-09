package backend.osiris.service.address;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.address.DistrictRequest;
import backend.osiris.dto.address.DistrictResponse;
import backend.osiris.mapper.address.DistrictMapper;
import backend.osiris.repository.address.DistrictRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DistrictServiceImpl implements DistrictService {

    private DistrictRepository districtRepository;

    private DistrictMapper districtMapper;

    @Override
    public ListResponse<DistrictResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.DISTRICT, districtRepository, districtMapper);
    }

    @Override
    public DistrictResponse findById(Long id) {
        return defaultFindById(id, districtRepository, districtMapper, ResourceName.DISTRICT);
    }

    @Override
    public DistrictResponse save(DistrictRequest request) {
        return defaultSave(request, districtRepository, districtMapper);
    }

    @Override
    public DistrictResponse save(Long id, DistrictRequest request) {
        return defaultSave(id, request, districtRepository, districtMapper, ResourceName.DISTRICT);
    }

    @Override
    public void delete(Long id) {
        districtRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        districtRepository.deleteAllById(ids);
    }

}