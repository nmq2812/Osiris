package backend.osiris.service.employee;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.JobLevelRequest;
import backend.osiris.dto.employee.JobLevelResponse;
import backend.osiris.mapper.employee.JobLevelMapper;
import backend.osiris.repository.employee.JobLevelRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class JobLevelServiceImpl implements JobLevelService {

    private JobLevelRepository jobLevelRepository;

    private JobLevelMapper jobLevelMapper;

    @Override
    public ListResponse<JobLevelResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.JOB_LEVEL, jobLevelRepository, jobLevelMapper);
    }

    @Override
    public JobLevelResponse findById(Long id) {
        return defaultFindById(id, jobLevelRepository, jobLevelMapper, ResourceName.JOB_LEVEL);
    }

    @Override
    public JobLevelResponse save(JobLevelRequest request) {
        return defaultSave(request, jobLevelRepository, jobLevelMapper);
    }

    @Override
    public JobLevelResponse save(Long id, JobLevelRequest request) {
        return defaultSave(id, request, jobLevelRepository, jobLevelMapper, ResourceName.JOB_LEVEL);
    }

    @Override
    public void delete(Long id) {
        jobLevelRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        jobLevelRepository.deleteAllById(ids);
    }

}