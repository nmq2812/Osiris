package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.GuaranteeRequest;
import backend.osiris.dto.product.GuaranteeResponse;
import backend.osiris.mapper.product.GuaranteeMapper;
import backend.osiris.repository.product.GuaranteeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class GuaranteeServiceImpl implements GuaranteeService {

    private GuaranteeRepository guaranteeRepository;

    private GuaranteeMapper guaranteeMapper;

    @Override
    public ListResponse<GuaranteeResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.GUARANTEE, guaranteeRepository, guaranteeMapper);
    }

    @Override
    public GuaranteeResponse findById(Long id) {
        return defaultFindById(id, guaranteeRepository, guaranteeMapper, ResourceName.GUARANTEE);
    }

    @Override
    public GuaranteeResponse save(GuaranteeRequest request) {
        return defaultSave(request, guaranteeRepository, guaranteeMapper);
    }

    @Override
    public GuaranteeResponse save(Long id, GuaranteeRequest request) {
        return defaultSave(id, request, guaranteeRepository, guaranteeMapper, ResourceName.GUARANTEE);
    }

    @Override
    public void delete(Long id) {
        guaranteeRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        guaranteeRepository.deleteAllById(ids);
    }

}