package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.CategoryRequest;
import backend.osiris.dto.product.CategoryResponse;
import backend.osiris.mapper.product.CategoryMapper;
import backend.osiris.repository.product.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private CategoryRepository categoryRepository;

    private CategoryMapper categoryMapper;

    @Override
    public ListResponse<CategoryResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.CATEGORY, categoryRepository, categoryMapper);
    }

    @Override
    public CategoryResponse findById(Long id) {
        return defaultFindById(id, categoryRepository, categoryMapper, ResourceName.CATEGORY);
    }

    @Override
    public CategoryResponse save(CategoryRequest request) {
        return defaultSave(request, categoryRepository, categoryMapper);
    }

    @Override
    public CategoryResponse save(Long id, CategoryRequest request) {
        return defaultSave(id, request, categoryRepository, categoryMapper, ResourceName.CATEGORY);
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        categoryRepository.deleteAllById(ids);
    }

}