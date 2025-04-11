package backend.osiris.service.inventory;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.DocketReasonRequest;
import backend.osiris.dto.inventory.DocketReasonResponse;
import backend.osiris.mapper.inventory.DocketReasonMapper;
import backend.osiris.repository.inventory.DocketReasonRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DocketReasonServiceImpl implements DocketReasonService {

    private DocketReasonRepository docketReasonRepository;

    private DocketReasonMapper docketReasonMapper;

    @Override
    public ListResponse<DocketReasonResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT_INVENTORY_LIMIT, docketReasonRepository, docketReasonMapper);
    }

    @Override
    public DocketReasonResponse findById(Long id) {
        return defaultFindById(id, docketReasonRepository, docketReasonMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public DocketReasonResponse save(DocketReasonRequest request) {
        return defaultSave(request, docketReasonRepository, docketReasonMapper);
    }

    @Override
    public DocketReasonResponse save(Long id, DocketReasonRequest request) {
        return defaultSave(id, request, docketReasonRepository, docketReasonMapper, ResourceName.PRODUCT_INVENTORY_LIMIT);
    }

    @Override
    public void delete(Long id) {
        docketReasonRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        docketReasonRepository.deleteAllById(ids);
    }

}