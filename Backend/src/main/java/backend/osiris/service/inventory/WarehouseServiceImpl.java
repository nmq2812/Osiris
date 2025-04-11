package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.WarehouseRequest;
import backend.osiris.dto.inventory.WarehouseResponse;
import backend.osiris.mapper.inventory.WarehouseMapper;
import backend.osiris.repository.inventory.WarehouseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private WarehouseRepository warehouseRepository;

    private WarehouseMapper warehouseMapper;

    @Override
    public ListResponse<WarehouseResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, warehouseRepository, warehouseMapper);
    }

    @Override
    public WarehouseResponse findById(Long id) {
        return defaultFindById(id, warehouseRepository, warehouseMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public WarehouseResponse save(WarehouseRequest request) {
        return defaultSave(request, warehouseRepository, warehouseMapper);
    }

    @Override
    public WarehouseResponse save(Long id, WarehouseRequest request) {
        return defaultSave(id, request, warehouseRepository, warehouseMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        warehouseRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        warehouseRepository.deleteAllById(ids);
    }

}