package backend.osiris.mapper.authentication;

import backend.osiris.dto.authentication.RoleRequest;
import backend.osiris.dto.authentication.RoleResponse;
import backend.osiris.entity.authentication.Role;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper extends GenericMapper<Role, RoleRequest, RoleResponse> {
}