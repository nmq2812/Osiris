package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.ProductInventoryLimitRequest;
import backend.osiris.dto.inventory.ProductInventoryLimitResponse;
import backend.osiris.mapper.inventory.ProductInventoryLimitMapper;
import backend.osiris.repository.inventory.ProductInventoryLimitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductInventoryLimitServiceImpl implements ProductInventoryLimitService {

    private ProductInventoryLimitRepository productInventoryLimitRepository;

    private ProductInventoryLimitMapper productInventoryLimitMapper;

    @Override
    public ListResponse<ProductInventoryLimitResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, productInventoryLimitRepository, productInventoryLimitMapper);
    }

    @Override
    public ProductInventoryLimitResponse findById(Long id) {
        return defaultFindById(id, productInventoryLimitRepository, productInventoryLimitMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public ProductInventoryLimitResponse save(ProductInventoryLimitRequest request) {
        return defaultSave(request, productInventoryLimitRepository, productInventoryLimitMapper);
    }

    @Override
    public ProductInventoryLimitResponse save(Long id, ProductInventoryLimitRequest request) {
        return defaultSave(id, request, productInventoryLimitRepository, productInventoryLimitMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        productInventoryLimitRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        productInventoryLimitRepository.deleteAllById(ids);
    }

}