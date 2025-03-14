package backend.osiris.service.employee;

import backend.osiris.constant.ResourceName;
import backend.osiris.constant.SearchFields;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.JobTitleRequest;
import backend.osiris.dto.employee.JobTitleResponse;
import backend.osiris.mapper.employee.JobTitleMapper;
import backend.osiris.repository.employee.JobTitleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class JobTitleServiceImpl implements JobTitleService {

    private JobTitleRepository jobTitleRepository;

    private JobTitleMapper jobTitleMapper;

    @Override
    public ListResponse<JobTitleResponse> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        return defaultFindAll(page, size, sort, filter, search, all, SearchFields.JOB_TITLE, jobTitleRepository, jobTitleMapper);
    }

    @Override
    public JobTitleResponse findById(Long id) {
        return defaultFindById(id, jobTitleRepository, jobTitleMapper, ResourceName.JOB_TITLE);
    }

    @Override
    public JobTitleResponse save(JobTitleRequest request) {
        return defaultSave(request, jobTitleRepository, jobTitleMapper);
    }

    @Override
    public JobTitleResponse save(Long id, JobTitleRequest request) {
        return defaultSave(id, request, jobTitleRepository, jobTitleMapper, ResourceName.JOB_TITLE);
    }

    @Override
    public void delete(Long id) {
        jobTitleRepository.deleteById(id);
    }

    @Override
    public void delete(List<Long> ids) {
        jobTitleRepository.deleteAllById(ids);
    }

}