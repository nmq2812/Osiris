package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.VariantRequest;
import backend.osiris.dto.product.VariantResponse;
import backend.osiris.mapper.product.VariantMapper;
import backend.osiris.repository.product.VariantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VariantServiceImpl implements VariantService {

    private VariantRepository variantRepository;

    private VariantMapper variantMapper;

    @Override
    public ListResponse<VariantResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.VARIANT, variantRepository, variantMapper);
    }

    @Override
    public VariantResponse findById(Long id) {
        return defaultFindById(id, variantRepository, variantMapper, ResourceName.VARIANT);
    }

    @Override
    public VariantResponse save(VariantRequest request) {
        return defaultSave(request, variantRepository, variantMapper);
    }

    @Override
    public VariantResponse save(Long id, VariantRequest request) {
        return defaultSave(id, request, variantRepository, variantMapper, ResourceName.VARIANT);
    }

    @Override
    public void delete(Long id) {
        variantRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        variantRepository.deleteAllById(ids);
    }

}