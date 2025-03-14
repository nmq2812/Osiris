package backend.osiris.service.employee;

import backend.osiris.dto.employee.JobLevelRequest;
import backend.osiris.dto.employee.JobLevelResponse;
import backend.osiris.service.CrudService;

public interface JobLevelService extends CrudService<Long, JobLevelRequest, JobLevelResponse> {}