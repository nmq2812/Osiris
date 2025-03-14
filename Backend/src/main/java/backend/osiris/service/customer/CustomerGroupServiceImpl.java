package backend.osiris.service.customer;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerGroupRequest;
import backend.osiris.dto.customer.CustomerGroupResponse;
import backend.osiris.mapper.customer.CustomerGroupMapper;
import backend.osiris.repository.customer.CustomerGroupRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerGroupServiceImpl implements CustomerGroupService {

    private CustomerGroupRepository customerGroupRepository;

    private CustomerGroupMapper customerGroupMapper;

    @Override
    public ListResponse<CustomerGroupResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.CUSTOMER_GROUP, customerGroupRepository, customerGroupMapper);
    }

    @Override
    public CustomerGroupResponse findById(Long id) {
        return defaultFindById(id, customerGroupRepository, customerGroupMapper, ResourceName.CUSTOMER_GROUP);
    }

    @Override
    public CustomerGroupResponse save(CustomerGroupRequest request) {
        return defaultSave(request, customerGroupRepository, customerGroupMapper);
    }

    @Override
    public CustomerGroupResponse save(Long id, CustomerGroupRequest request) {
        return defaultSave(id, request, customerGroupRepository, customerGroupMapper, ResourceName.CUSTOMER_GROUP);
    }

    @Override
    public void delete(Long id) {
        customerGroupRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        customerGroupRepository.deleteAllById(ids);
    }

}