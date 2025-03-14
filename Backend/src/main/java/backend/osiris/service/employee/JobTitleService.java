package backend.osiris.service.employee;

import backend.osiris.dto.employee.JobTitleRequest;
import backend.osiris.dto.employee.JobTitleResponse;
import backend.osiris.service.CrudService;

public interface JobTitleService extends CrudService<Long, JobTitleRequest, JobTitleResponse> {}