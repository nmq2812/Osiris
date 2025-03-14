package backend.osiris.service.employee;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.EmployeeRequest;
import backend.osiris.dto.employee.EmployeeResponse;
import backend.osiris.mapper.employee.EmployeeMapper;
import backend.osiris.repository.employee.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;

    private EmployeeMapper employeeMapper;

    @Override
    public ListResponse<EmployeeResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.EMPLOYEE, employeeRepository, employeeMapper);
    }

    @Override
    public EmployeeResponse findById(Long id) {
        return defaultFindById(id, employeeRepository, employeeMapper, ResourceName.EMPLOYEE);
    }

    @Override
    public EmployeeResponse save(EmployeeRequest request) {
        return defaultSave(request, employeeRepository, employeeMapper);
    }

    @Override
    public EmployeeResponse save(Long id, EmployeeRequest request) {
        return defaultSave(id, request, employeeRepository, employeeMapper, ResourceName.EMPLOYEE);
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        employeeRepository.deleteAllById(ids);
    }

}