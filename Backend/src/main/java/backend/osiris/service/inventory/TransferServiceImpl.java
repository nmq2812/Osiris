package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.TransferRequest;
import backend.osiris.dto.inventory.TransferResponse;
import backend.osiris.mapper.inventory.TransferMapper;
import backend.osiris.repository.inventory.TransferRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TransferServiceImpl implements TransferService {

    private TransferRepository transferRepository;

    private TransferMapper transferMapper;

    @Override
    public ListResponse<TransferResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, transferRepository, transferMapper);
    }

    @Override
    public TransferResponse findById(Long id) {
        return defaultFindById(id, transferRepository, transferMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public TransferResponse save(TransferRequest request) {
        return defaultSave(request, transferRepository, transferMapper);
    }

    @Override
    public TransferResponse save(Long id, TransferRequest request) {
        return defaultSave(id, request, transferRepository, transferMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        transferRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        transferRepository.deleteAllById(ids);
    }

}