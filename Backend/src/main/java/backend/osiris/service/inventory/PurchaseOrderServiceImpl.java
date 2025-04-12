package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.PurchaseOrderRequest;
import backend.osiris.dto.inventory.PurchaseOrderResponse;
import backend.osiris.mapper.inventory.PurchaseOrderMapper;
import backend.osiris.repository.inventory.PurchaseOrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private PurchaseOrderRepository purchaseOrderRepository;

    private PurchaseOrderMapper purchaseOrderMapper;

    @Override
    public ListResponse<PurchaseOrderResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PURCHASE_ORDER, purchaseOrderRepository, purchaseOrderMapper);
    }

    @Override
    public PurchaseOrderResponse findById(Long id) {
        return defaultFindById(id, purchaseOrderRepository, purchaseOrderMapper, ResourceName.PURCHASE_ORDER);
    }

    @Override
    public PurchaseOrderResponse save(PurchaseOrderRequest request) {
        return defaultSave(request, purchaseOrderRepository, purchaseOrderMapper);
    }

    @Override
    public PurchaseOrderResponse save(Long id, PurchaseOrderRequest request) {
        return defaultSave(id, request, purchaseOrderRepository, purchaseOrderMapper, ResourceName.PURCHASE_ORDER);
    }

    @Override
    public void delete(Long id) {
        purchaseOrderRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        purchaseOrderRepository.deleteAllById(ids);
    }

}