package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.DocketVariantRequest;
import backend.osiris.dto.inventory.DocketVariantResponse;
import backend.osiris.entity.inventory.DocketVariantKey;
import backend.osiris.mapper.inventory.DocketVariantMapper;
import backend.osiris.repository.inventory.DocketVariantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DocketVariantServiceImpl implements DocketVariantService {

    private DocketVariantRepository docketVariantRepository;

    private DocketVariantMapper docketVariantMapper;

    @Override
    public ListResponse<DocketVariantResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.DOCKET_VARIANT, docketVariantRepository, docketVariantMapper);
    }

    @Override
    public DocketVariantResponse findById(DocketVariantKey id) {
        return defaultFindById(id, docketVariantRepository, docketVariantMapper, ResourceName.DOCKET_VARIANT);
    }

    @Override
    public DocketVariantResponse save(DocketVariantRequest request) {
        return defaultSave(request, docketVariantRepository, docketVariantMapper);
    }

    @Override
    public DocketVariantResponse save(DocketVariantKey id, DocketVariantRequest request) {
        return defaultSave(id, request, docketVariantRepository, docketVariantMapper, ResourceName.DOCKET_VARIANT);
    }

    @Override
    public void delete(DocketVariantKey id) {
        docketVariantRepository.deleteById(id);
    }

    @Override
    public void delete(List<DocketVariantKey> ids) {
        docketVariantRepository.deleteAllById(ids);
    }

}
