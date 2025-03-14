package backend.osiris.mapper.employee;

import backend.osiris.dto.employee.JobTypeRequest;
import backend.osiris.dto.employee.JobTypeResponse;
import backend.osiris.entity.employee.JobType;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface JobTypeMapper extends GenericMapper<JobType, JobTypeRequest, JobTypeResponse> {
}