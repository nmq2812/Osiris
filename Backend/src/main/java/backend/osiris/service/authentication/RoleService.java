package backend.osiris.service.authentication;

import backend.osiris.dto.authentication.RoleRequest;
import backend.osiris.dto.authentication.RoleResponse;
import backend.osiris.service.CrudService;

public interface RoleService extends CrudService<Long, RoleRequest, RoleResponse> {}