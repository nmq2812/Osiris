package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.CountVariantRequest;
import backend.osiris.dto.inventory.CountVariantResponse;
import backend.osiris.entity.inventory.CountVariantKey;
import backend.osiris.mapper.inventory.CountVariantMapper;
import backend.osiris.repository.inventory.CountVariantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CountVariantServiceImpl implements CountVariantService {

    private CountVariantRepository countVariantRepository;

    private CountVariantMapper countVariantMapper;

    @Override
    public ListResponse<CountVariantResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.COUNT_VARIANT, countVariantRepository, countVariantMapper);
    }

    @Override
    public CountVariantResponse findById(CountVariantKey id) {
        return defaultFindById(id, countVariantRepository, countVariantMapper, ResourceName.COUNT_VARIANT);
    }

    @Override
    public CountVariantResponse save(CountVariantRequest request) {
        return defaultSave(request, countVariantRepository, countVariantMapper);
    }

    @Override
    public CountVariantResponse save(CountVariantKey id, CountVariantRequest request) {
        return defaultSave(id, request, countVariantRepository, countVariantMapper, ResourceName.COUNT_VARIANT);
    }

    @Override
    public void delete(CountVariantKey id) {
        countVariantRepository.deleteById(id);
    }

    @Override
    public void delete(List<CountVariantKey> ids) {
        countVariantRepository.deleteAllById(ids);
    }

}
