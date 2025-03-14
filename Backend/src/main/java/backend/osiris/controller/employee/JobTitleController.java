package backend.osiris.controller.employee;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.JobTitleRequest;
import backend.osiris.dto.employee.JobTitleResponse;
import backend.osiris.service.employee.JobTitleService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-titles")
@AllArgsConstructor
public class JobTitleController {

    private JobTitleService jobTitleService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllJobTitles(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(jobTitleService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobTitleResponse> getJobTitle(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(jobTitleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<JobTitleResponse> createJobTitle(@RequestBody JobTitleRequest jobTitleRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobTitleService.save(jobTitleRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobTitleResponse> updateJobTitle(@PathVariable("id") Long id,
                                                           @RequestBody JobTitleRequest jobTitleRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(jobTitleService.save(id, jobTitleRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobTitle(@PathVariable("id") Long id) {
        jobTitleService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteJobTitles(@RequestBody List<Long> ids) {
        jobTitleService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}