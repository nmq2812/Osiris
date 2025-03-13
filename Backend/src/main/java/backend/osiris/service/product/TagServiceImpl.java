package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.TagRequest;
import backend.osiris.dto.product.TagResponse;
import backend.osiris.mapper.product.TagMapper;
import backend.osiris.repository.product.TagRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TagServiceImpl implements TagService {

    private TagRepository tagRepository;

    private TagMapper tagMapper;

    @Override
    public ListResponse<TagResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.TAG, tagRepository, tagMapper);
    }

    @Override
    public TagResponse findById(Long id) {
        return defaultFindById(id, tagRepository, tagMapper, ResourceName.TAG);
    }

    @Override
    public TagResponse save(TagRequest request) {
        return defaultSave(request, tagRepository, tagMapper);
    }

    @Override
    public TagResponse save(Long id, TagRequest request) {
        return defaultSave(id, request, tagRepository, tagMapper, ResourceName.TAG);
    }

    @Override
    public void delete(Long id) {
        tagRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        tagRepository.deleteAllById(ids);
    }

}