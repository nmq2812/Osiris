package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.CountRequest;
import backend.osiris.dto.inventory.CountResponse;
import backend.osiris.service.inventory.CountService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/counts")
@AllArgsConstructor
public class CountController {

    private CountService countService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllCounts(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(countService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CountResponse> getCount(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(countService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CountResponse> createCount(@RequestBody CountRequest countRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(countService.save(countRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CountResponse> updateCount(@PathVariable("id") Long id,
                                                             @RequestBody CountRequest countRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(countService.save(id, countRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCount(@PathVariable("id") Long id) {
        countService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCounts(@RequestBody List<Long> ids) {
        countService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}