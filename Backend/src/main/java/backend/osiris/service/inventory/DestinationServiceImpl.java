package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.DestinationRequest;
import backend.osiris.dto.inventory.DestinationResponse;
import backend.osiris.mapper.inventory.DestinationMapper;
import backend.osiris.repository.inventory.DestinationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DestinationServiceImpl implements DestinationService {

    private DestinationRepository destinationRepository;

    private DestinationMapper destinationMapper;

    @Override
    public ListResponse<DestinationResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, destinationRepository, destinationMapper);
    }

    @Override
    public DestinationResponse findById(Long id) {
        return defaultFindById(id, destinationRepository, destinationMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public DestinationResponse save(DestinationRequest request) {
        return defaultSave(request, destinationRepository, destinationMapper);
    }

    @Override
    public DestinationResponse save(Long id, DestinationRequest request) {
        return defaultSave(id, request, destinationRepository, destinationMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        destinationRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        destinationRepository.deleteAllById(ids);
    }

}