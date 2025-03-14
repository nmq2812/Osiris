package backend.osiris.service.employee;

import backend.osiris.dto.employee.EmployeeRequest;
import backend.osiris.dto.employee.EmployeeResponse;
import backend.osiris.service.CrudService;

public interface EmployeeService extends CrudService<Long, EmployeeRequest, EmployeeResponse> {}