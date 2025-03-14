package backend.osiris.mapper.employee;

import backend.osiris.dto.employee.JobTitleRequest;
import backend.osiris.dto.employee.JobTitleResponse;
import backend.osiris.entity.employee.JobTitle;
import backend.osiris.mapper.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface JobTitleMapper extends GenericMapper<JobTitle, JobTitleRequest, JobTitleResponse> {
}