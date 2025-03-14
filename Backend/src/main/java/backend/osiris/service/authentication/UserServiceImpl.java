package backend.osiris.service.authentication;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.authentication.UserRequest;
import backend.osiris.dto.authentication.UserResponse;
import backend.osiris.mapper.authentication.UserMapper;
import backend.osiris.repository.authentication.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    private UserMapper userMapper;

    @Override
    public ListResponse<UserResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.USER, userRepository, userMapper);
    }

    @Override
    public UserResponse findById(Long id) {
        return defaultFindById(id, userRepository, userMapper, ResourceName.USER);
    }

    @Override
    public UserResponse save(UserRequest request) {
        return defaultSave(request, userRepository, userMapper);
    }

    @Override
    public UserResponse save(Long id, UserRequest request) {
        return defaultSave(id, request, userRepository, userMapper, ResourceName.USER);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        userRepository.deleteAllById(ids);
    }

}