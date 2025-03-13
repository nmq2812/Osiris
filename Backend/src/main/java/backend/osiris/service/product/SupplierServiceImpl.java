package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.SupplierRequest;
import backend.osiris.dto.product.SupplierResponse;
import backend.osiris.mapper.product.SupplierMapper;
import backend.osiris.repository.product.SupplierRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private SupplierRepository supplierRepository;

    private SupplierMapper supplierMapper;

    @Override
    public ListResponse<SupplierResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.SUPPLIER, supplierRepository, supplierMapper);
    }

    @Override
    public SupplierResponse findById(Long id) {
        return defaultFindById(id, supplierRepository, supplierMapper, ResourceName.SUPPLIER);
    }

    @Override
    public SupplierResponse save(SupplierRequest request) {
        return defaultSave(request, supplierRepository, supplierMapper);
    }

    @Override
    public SupplierResponse save(Long id, SupplierRequest request) {
        return defaultSave(id, request, supplierRepository, supplierMapper, ResourceName.SUPPLIER);
    }

    @Override
    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        supplierRepository.deleteAllById(ids);
    }

}