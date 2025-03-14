package backend.osiris.controller.employee;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.JobTypeRequest;
import backend.osiris.dto.employee.JobTypeResponse;
import backend.osiris.service.employee.JobTypeService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-types")
@AllArgsConstructor
public class JobTypeController {

    private JobTypeService jobTypeService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllJobTypes(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(jobTypeService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobTypeResponse> getJobType(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(jobTypeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<JobTypeResponse> createJobType(@RequestBody JobTypeRequest jobTypeRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobTypeService.save(jobTypeRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobTypeResponse> updateJobType(@PathVariable("id") Long id,
                                                           @RequestBody JobTypeRequest jobTypeRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(jobTypeService.save(id, jobTypeRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobType(@PathVariable("id") Long id) {
        jobTypeService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteJobTypes(@RequestBody List<Long> ids) {
        jobTypeService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}