package backend.osiris.service.customer;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerResourceRequest;
import backend.osiris.dto.customer.CustomerResourceResponse;
import backend.osiris.mapper.customer.CustomerResourceMapper;
import backend.osiris.repository.customer.CustomerResourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerResourceServiceImpl implements CustomerResourceService {

    private CustomerResourceRepository customerResourceRepository;

    private CustomerResourceMapper customerResourceMapper;

    @Override
    public ListResponse<CustomerResourceResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.CUSTOMER_RESOURCE, customerResourceRepository, customerResourceMapper);
    }

    @Override
    public CustomerResourceResponse findById(Long id) {
        return defaultFindById(id, customerResourceRepository, customerResourceMapper, ResourceName.CUSTOMER_RESOURCE);
    }

    @Override
    public CustomerResourceResponse save(CustomerResourceRequest request) {
        return defaultSave(request, customerResourceRepository, customerResourceMapper);
    }

    @Override
    public CustomerResourceResponse save(Long id, CustomerResourceRequest request) {
        return defaultSave(id, request, customerResourceRepository, customerResourceMapper, ResourceName.CUSTOMER_RESOURCE);
    }

    @Override
    public void delete(Long id) {
        customerResourceRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        customerResourceRepository.deleteAllById(ids);
    }

}