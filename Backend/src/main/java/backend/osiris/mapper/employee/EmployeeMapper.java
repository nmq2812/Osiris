package backend.osiris.mapper.employee;

import backend.osiris.dto.employee.EmployeeRequest;
import backend.osiris.dto.employee.EmployeeResponse;
import backend.osiris.entity.employee.Employee;
import backend.osiris.mapper.GenericMapper;
import backend.osiris.mapper.authentication.UserMapper;
import backend.osiris.utils.MapperUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {MapperUtils.class, UserMapper.class})
public interface EmployeeMapper extends GenericMapper<Employee, EmployeeRequest, EmployeeResponse> {

    @Override
    @Mapping(source = "officeId", target = "office")
    @Mapping(source = "departmentId", target = "department")
    @Mapping(source = "jobTypeId", target = "jobType")
    @Mapping(source = "jobLevelId", target = "jobLevel")
    @Mapping(source = "jobTitleId", target = "jobTitle")
    Employee requestToEntity(EmployeeRequest request);

    @Override
    @Mapping(source = "officeId", target = "office")
    @Mapping(source = "departmentId", target = "department")
    @Mapping(source = "jobTypeId", target = "jobType")
    @Mapping(source = "jobLevelId", target = "jobLevel")
    @Mapping(source = "jobTitleId", target = "jobTitle")
    Employee partialUpdate(@MappingTarget Employee entity, EmployeeRequest request);

}