package backend.osiris.mapper.employee;

import backend.osiris.dto.employee.JobLevelRequest;
import backend.osiris.dto.employee.JobLevelResponse;
import backend.osiris.entity.employee.JobLevel;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface JobLevelMapper extends GenericMapper<JobLevel, JobLevelRequest, JobLevelResponse> {
}