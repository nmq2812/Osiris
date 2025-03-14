package backend.osiris.controller.employee;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.JobLevelRequest;
import backend.osiris.dto.employee.JobLevelResponse;
import backend.osiris.service.employee.JobLevelService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-levels")
@AllArgsConstructor
public class JobLevelController {

    private JobLevelService jobLevelService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllJobLevels(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(jobLevelService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobLevelResponse> getJobLevel(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(jobLevelService.findById(id));
    }

    @PostMapping
    public ResponseEntity<JobLevelResponse> createJobLevel(@RequestBody JobLevelRequest jobLevelRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobLevelService.save(jobLevelRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobLevelResponse> updateJobLevel(@PathVariable("id") Long id,
                                                       @RequestBody JobLevelRequest jobLevelRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(jobLevelService.save(id, jobLevelRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobLevel(@PathVariable("id") Long id) {
        jobLevelService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteJobLevels(@RequestBody List<Long> ids) {
        jobLevelService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}