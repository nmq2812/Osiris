package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.CountRequest;
import backend.osiris.dto.inventory.CountResponse;
import backend.osiris.mapper.inventory.CountMapper;
import backend.osiris.repository.inventory.CountRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CountServiceImpl implements CountService {

    private CountRepository countRepository;

    private CountMapper countMapper;

    @Override
    public ListResponse<CountResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, countRepository, countMapper);
    }

    @Override
    public CountResponse findById(Long id) {
        return defaultFindById(id, countRepository, countMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public CountResponse save(CountRequest request) {
        return defaultSave(request, countRepository, countMapper);
    }

    @Override
    public CountResponse save(Long id, CountRequest request) {
        return defaultSave(id, request, countRepository, countMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        countRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        countRepository.deleteAllById(ids);
    }

}