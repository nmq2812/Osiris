package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.BrandRequest;
import backend.osiris.dto.product.BrandResponse;
import backend.osiris.mapper.product.BrandMapper;
import backend.osiris.repository.product.BrandRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BrandServiceImpl implements BrandService {

    private BrandRepository brandRepository;

    private BrandMapper brandMapper;

    @Override
    public ListResponse<BrandResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.BRAND, brandRepository, brandMapper);
    }

    @Override
    public BrandResponse findById(Long id) {
        return defaultFindById(id, brandRepository, brandMapper, ResourceName.BRAND);
    }

    @Override
    public BrandResponse save(BrandRequest request) {
        return defaultSave(request, brandRepository, brandMapper);
    }

    @Override
    public BrandResponse save(Long id, BrandRequest request) {
        return defaultSave(id, request, brandRepository, brandMapper, ResourceName.BRAND);
    }

    @Override
    public void delete(Long id) {
        brandRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        brandRepository.deleteAllById(ids);
    }

}