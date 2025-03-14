package backend.osiris.service.employee;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.DepartmentRequest;
import backend.osiris.dto.employee.DepartmentResponse;
import backend.osiris.mapper.employee.DepartmentMapper;
import backend.osiris.repository.employee.DepartmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private DepartmentRepository departmentRepository;

    private DepartmentMapper departmentMapper;

    @Override
    public ListResponse<DepartmentResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.DEPARTMENT, departmentRepository, departmentMapper);
    }

    @Override
    public DepartmentResponse findById(Long id) {
        return defaultFindById(id, departmentRepository, departmentMapper, ResourceName.DEPARTMENT);
    }

    @Override
    public DepartmentResponse save(DepartmentRequest request) {
        return defaultSave(request, departmentRepository, departmentMapper);
    }

    @Override
    public DepartmentResponse save(Long id, DepartmentRequest request) {
        return defaultSave(id, request, departmentRepository, departmentMapper, ResourceName.DEPARTMENT);
    }

    @Override
    public void delete(Long id) {
        departmentRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        departmentRepository.deleteAllById(ids);
    }

}