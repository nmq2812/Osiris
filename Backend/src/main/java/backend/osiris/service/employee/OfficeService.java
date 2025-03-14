package backend.osiris.service.employee;

import backend.osiris.dto.employee.OfficeRequest;
import backend.osiris.dto.employee.OfficeResponse;
import backend.osiris.service.CrudService;

public interface OfficeService extends CrudService<Long, OfficeRequest, OfficeResponse> {}