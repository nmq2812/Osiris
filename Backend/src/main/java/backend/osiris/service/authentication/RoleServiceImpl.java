package backend.osiris.service.authentication;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.authentication.RoleRequest;
import backend.osiris.dto.authentication.RoleResponse;
import backend.osiris.mapper.authentication.RoleMapper;
import backend.osiris.repository.authentication.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private RoleRepository roleRepository;

    private RoleMapper roleMapper;

    @Override
    public ListResponse<RoleResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.ROLE, roleRepository, roleMapper);
    }

    @Override
    public RoleResponse findById(Long id) {
        return defaultFindById(id, roleRepository, roleMapper, ResourceName.ROLE);
    }

    @Override
    public RoleResponse save(RoleRequest request) {
        return defaultSave(request, roleRepository, roleMapper);
    }

    @Override
    public RoleResponse save(Long id, RoleRequest request) {
        return defaultSave(id, request, roleRepository, roleMapper, ResourceName.ROLE);
    }

    @Override
    public void delete(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        roleRepository.deleteAllById(ids);
    }

}