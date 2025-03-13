package backend.osiris.service.product;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.PropertyRequest;
import backend.osiris.dto.product.PropertyResponse;
import backend.osiris.mapper.product.PropertyMapper;
import backend.osiris.repository.product.PropertyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private PropertyRepository propertyRepository;

    private PropertyMapper propertyMapper;

    @Override
    public ListResponse<PropertyResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.PROPERTY, propertyRepository, propertyMapper);
    }

    @Override
    public PropertyResponse findById(Long id) {
        return defaultFindById(id, propertyRepository, propertyMapper, ResourceName.PROPERTY);
    }

    @Override
    public PropertyResponse save(PropertyRequest request) {
        return defaultSave(request, propertyRepository, propertyMapper);
    }

    @Override
    public PropertyResponse save(Long id, PropertyRequest request) {
        return defaultSave(id, request, propertyRepository, propertyMapper, ResourceName.PROPERTY);
    }

    @Override
    public void delete(Long id) {
        propertyRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        propertyRepository.deleteAllById(ids);
    }

}