package backend.osiris.service.employee;

import backend.osiris.dto.employee.JobTypeRequest;
import backend.osiris.dto.employee.JobTypeResponse;
import backend.osiris.service.CrudService;

public interface JobTypeService extends CrudService<Long, JobTypeRequest, JobTypeResponse> {}