package backend.osiris.service.address;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.address.WardRequest;
import backend.osiris.dto.address.WardResponse;
import backend.osiris.mapper.address.WardMapper;
import backend.osiris.repository.address.WardRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class WardServiceImpl implements WardService {

    private WardRepository wardRepository;

    private WardMapper wardMapper;

    @Override
    public ListResponse<WardResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.WARD, wardRepository, wardMapper);
    }

    @Override
    public WardResponse findById(Long id) {
        return defaultFindById(id, wardRepository, wardMapper, ResourceName.WARD);
    }

    @Override
    public WardResponse save(WardRequest request) {
        return defaultSave(request, wardRepository, wardMapper);
    }

    @Override
    public WardResponse save(Long id, WardRequest request) {
        return defaultSave(id, request, wardRepository, wardMapper, ResourceName.WARD);
    }

    @Override
    public void delete(Long id) {
        wardRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        wardRepository.deleteAllById(ids);
    }

}