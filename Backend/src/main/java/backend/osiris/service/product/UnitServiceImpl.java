package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.UnitRequest;
import backend.osiris.dto.product.UnitResponse;
import backend.osiris.mapper.product.UnitMapper;
import backend.osiris.repository.product.UnitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UnitServiceImpl implements UnitService {

    private UnitRepository unitRepository;

    private UnitMapper unitMapper;

    @Override
    public ListResponse<UnitResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.UNIT, unitRepository, unitMapper);
    }

    @Override
    public UnitResponse findById(Long id) {
        return defaultFindById(id, unitRepository, unitMapper, ResourceName.UNIT);
    }

    @Override
    public UnitResponse save(UnitRequest request) {
        return defaultSave(request, unitRepository, unitMapper);
    }

    @Override
    public UnitResponse save(Long id, UnitRequest request) {
        return defaultSave(id, request, unitRepository, unitMapper, ResourceName.UNIT);
    }

    @Override
    public void delete(Long id) {
        unitRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        unitRepository.deleteAllById(ids);
    }

}