package backend.osiris.service.authentication;

import backend.osiris.dto.authentication.UserRequest;
import backend.osiris.dto.authentication.UserResponse;
import backend.osiris.service.CrudService;

public interface UserService extends CrudService<Long, UserRequest, UserResponse> {}