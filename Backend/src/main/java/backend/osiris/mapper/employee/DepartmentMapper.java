package backend.osiris.mapper.employee;

import backend.osiris.dto.employee.DepartmentRequest;
import backend.osiris.dto.employee.DepartmentResponse;
import backend.osiris.entity.employee.Department;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DepartmentMapper extends GenericMapper<Department, DepartmentRequest, DepartmentResponse> {
}