package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.SpecificationRequest;
import backend.osiris.dto.product.SpecificationResponse;
import backend.osiris.mapper.product.SpecificationMapper;
import backend.osiris.repository.product.SpecificationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SpecificationServiceImpl implements SpecificationService {

    private SpecificationRepository specificationRepository;

    private SpecificationMapper specificationMapper;

    @Override
    public ListResponse<SpecificationResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.SPECIFICATION, specificationRepository, specificationMapper);
    }

    @Override
    public SpecificationResponse findById(Long id) {
        return defaultFindById(id, specificationRepository, specificationMapper, ResourceName.SPECIFICATION);
    }

    @Override
    public SpecificationResponse save(SpecificationRequest request) {
        return defaultSave(request, specificationRepository, specificationMapper);
    }

    @Override
    public SpecificationResponse save(Long id, SpecificationRequest request) {
        return defaultSave(id, request, specificationRepository, specificationMapper, ResourceName.SPECIFICATION);
    }

    @Override
    public void delete(Long id) {
        specificationRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        specificationRepository.deleteAllById(ids);
    }

}