package backend.osiris.service.customer;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerRequest;
import backend.osiris.dto.customer.CustomerResponse;
import backend.osiris.mapper.customer.CustomerMapper;
import backend.osiris.repository.customer.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private CustomerRepository customerRepository;

    private CustomerMapper customerMapper;

    @Override
    public ListResponse<CustomerResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.CUSTOMER, customerRepository, customerMapper);
    }

    @Override
    public CustomerResponse findById(Long id) {
        return defaultFindById(id, customerRepository, customerMapper, ResourceName.CUSTOMER);
    }

    @Override
    public CustomerResponse save(CustomerRequest request) {
        return defaultSave(request, customerRepository, customerMapper);
    }

    @Override
    public CustomerResponse save(Long id, CustomerRequest request) {
        return defaultSave(id, request, customerRepository, customerMapper, ResourceName.CUSTOMER);
    }

    @Override
    public void delete(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        customerRepository.deleteAllById(ids);
    }

}