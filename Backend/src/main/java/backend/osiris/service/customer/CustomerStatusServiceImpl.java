package backend.osiris.service.customer;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerStatusRequest;
import backend.osiris.dto.customer.CustomerStatusResponse;
import backend.osiris.mapper.customer.CustomerStatusMapper;
import backend.osiris.repository.customer.CustomerStatusRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerStatusServiceImpl implements CustomerStatusService {

    private CustomerStatusRepository customerStatusRepository;

    private CustomerStatusMapper customerStatusMapper;

    @Override
    public ListResponse<CustomerStatusResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.CUSTOMER_STATUS, customerStatusRepository, customerStatusMapper);
    }

    @Override
    public CustomerStatusResponse findById(Long id) {
        return defaultFindById(id, customerStatusRepository, customerStatusMapper, ResourceName.CUSTOMER_STATUS);
    }

    @Override
    public CustomerStatusResponse save(CustomerStatusRequest request) {
        return defaultSave(request, customerStatusRepository, customerStatusMapper);
    }

    @Override
    public CustomerStatusResponse save(Long id, CustomerStatusRequest request) {
        return defaultSave(id, request, customerStatusRepository, customerStatusMapper, ResourceName.CUSTOMER_STATUS);
    }

    @Override
    public void delete(Long id) {
        customerStatusRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        customerStatusRepository.deleteAllById(ids);
    }

}