package backend.osiris.service.employee;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.JobTypeRequest;
import backend.osiris.dto.employee.JobTypeResponse;
import backend.osiris.mapper.employee.JobTypeMapper;
import backend.osiris.repository.employee.JobTypeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class JobTypeServiceImpl implements JobTypeService {

    private JobTypeRepository jobTypeRepository;

    private JobTypeMapper jobTypeMapper;

    @Override
    public ListResponse<JobTypeResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.JOB_TYPE, jobTypeRepository, jobTypeMapper);
    }

    @Override
    public JobTypeResponse findById(Long id) {
        return defaultFindById(id, jobTypeRepository, jobTypeMapper, ResourceName.JOB_TYPE);
    }

    @Override
    public JobTypeResponse save(JobTypeRequest request) {
        return defaultSave(request, jobTypeRepository, jobTypeMapper);
    }

    @Override
    public JobTypeResponse save(Long id, JobTypeRequest request) {
        return defaultSave(id, request, jobTypeRepository, jobTypeMapper, ResourceName.JOB_TYPE);
    }

    @Override
    public void delete(Long id) {
        jobTypeRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        jobTypeRepository.deleteAllById(ids);
    }

}