package backend.osiris.service.employee;

import backend.osiris.dto.employee.DepartmentRequest;
import backend.osiris.dto.employee.DepartmentResponse;
import backend.osiris.service.CrudService;

public interface DepartmentService extends CrudService<Long, DepartmentRequest, DepartmentResponse> {}