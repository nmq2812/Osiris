package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.StorageLocationRequest;
import backend.osiris.dto.inventory.StorageLocationResponse;
import backend.osiris.mapper.inventory.StorageLocationMapper;
import backend.osiris.repository.inventory.StorageLocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StorageLocationServiceImpl implements StorageLocationService {

    private StorageLocationRepository storageLocationRepository;

    private StorageLocationMapper storageLocationMapper;

    @Override
    public ListResponse<StorageLocationResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, storageLocationRepository, storageLocationMapper);
    }

    @Override
    public StorageLocationResponse findById(Long id) {
        return defaultFindById(id, storageLocationRepository, storageLocationMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public StorageLocationResponse save(StorageLocationRequest request) {
        return defaultSave(request, storageLocationRepository, storageLocationMapper);
    }

    @Override
    public StorageLocationResponse save(Long id, StorageLocationRequest request) {
        return defaultSave(id, request, storageLocationRepository, storageLocationMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        storageLocationRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        storageLocationRepository.deleteAllById(ids);
    }

}