package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.VariantInventoryLimitRequest;
import backend.osiris.dto.inventory.VariantInventoryLimitResponse;
import backend.osiris.mapper.inventory.VariantInventoryLimitMapper;
import backend.osiris.repository.inventory.VariantInventoryLimitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VariantInventoryLimitServiceImpl implements VariantInventoryLimitService {

    private VariantInventoryLimitRepository variantInventoryLimitRepository;

    private VariantInventoryLimitMapper variantInventoryLimitMapper;

    @Override
    public ListResponse<VariantInventoryLimitResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, variantInventoryLimitRepository, variantInventoryLimitMapper);
    }

    @Override
    public VariantInventoryLimitResponse findById(Long id) {
        return defaultFindById(id, variantInventoryLimitRepository, variantInventoryLimitMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public VariantInventoryLimitResponse save(VariantInventoryLimitRequest request) {
        return defaultSave(request, variantInventoryLimitRepository, variantInventoryLimitMapper);
    }

    @Override
    public VariantInventoryLimitResponse save(Long id, VariantInventoryLimitRequest request) {
        return defaultSave(id, request, variantInventoryLimitRepository, variantInventoryLimitMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        variantInventoryLimitRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        variantInventoryLimitRepository.deleteAllById(ids);
    }

}