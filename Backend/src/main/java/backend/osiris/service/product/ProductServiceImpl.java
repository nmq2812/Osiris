package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.ProductRequest;
import backend.osiris.dto.product.ProductResponse;
import backend.osiris.mapper.product.ProductMapper;
import backend.osiris.repository.product.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

    private ProductRepository productRepository;

    private ProductMapper productMapper;

    @Override
    public ListResponse<ProductResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PRODUCT, productRepository, productMapper);
    }

    @Override
    public ProductResponse findById(Long id) {
        return defaultFindById(id, productRepository, productMapper, ResourceName.PRODUCT);
    }

    @Override
    public ProductResponse save(ProductRequest request) {
        return defaultSave(request, productRepository, productMapper);
    }

    @Override
    public ProductResponse save(Long id, ProductRequest request) {
        return defaultSave(id, request, productRepository, productMapper, ResourceName.PRODUCT);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        productRepository.deleteAllById(ids);
    }

}