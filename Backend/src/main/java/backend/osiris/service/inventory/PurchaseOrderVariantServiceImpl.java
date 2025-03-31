package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.PurchaseOrderVariantRequest;
import backend.osiris.dto.inventory.PurchaseOrderVariantResponse;
import backend.osiris.entity.inventory.PurchaseOrderVariantKey;
import backend.osiris.mapper.inventory.PurchaseOrderVariantMapper;
import backend.osiris.repository.inventory.PurchaseOrderVariantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PurchaseOrderVariantServiceImpl implements PurchaseOrderVariantService {

    private PurchaseOrderVariantRepository purchaseOrderVariantRepository;

    private PurchaseOrderVariantMapper purchaseOrderVariantMapper;

    @Override
    public ListResponse<PurchaseOrderVariantResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PURCHASE_ORDER_VARIANT, purchaseOrderVariantRepository, purchaseOrderVariantMapper);
    }

    @Override
    public PurchaseOrderVariantResponse findById(PurchaseOrderVariantKey id) {
        return defaultFindById(id, purchaseOrderVariantRepository, purchaseOrderVariantMapper, ResourceName.PURCHASE_ORDER_VARIANT);
    }

    @Override
    public PurchaseOrderVariantResponse save(PurchaseOrderVariantRequest request) {
        return defaultSave(request, purchaseOrderVariantRepository, purchaseOrderVariantMapper);
    }

    @Override
    public PurchaseOrderVariantResponse save(PurchaseOrderVariantKey id, PurchaseOrderVariantRequest request) {
        return defaultSave(id, request, purchaseOrderVariantRepository, purchaseOrderVariantMapper, ResourceName.PURCHASE_ORDER_VARIANT);
    }

    @Override
    public void delete(PurchaseOrderVariantKey id) {
        purchaseOrderVariantRepository.deleteById(id);
    }

    @Override
    public void delete(List<PurchaseOrderVariantKey> ids) {
        purchaseOrderVariantRepository.deleteAllById(ids);
    }

}
