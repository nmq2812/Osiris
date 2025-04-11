package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.DocketReasonRequest;
import backend.osiris.dto.inventory.DocketReasonResponse;
import backend.osiris.service.inventory.DocketReasonService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docket_reasons")
@AllArgsConstructor
public class DocketReasonController {

    private DocketReasonService docketReasonService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllDocketReasons(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(docketReasonService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocketReasonResponse> getDocketReason(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(docketReasonService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DocketReasonResponse> createDocketReason(@RequestBody DocketReasonRequest docketReasonRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(docketReasonService.save(docketReasonRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocketReasonResponse> updateDocketReason(@PathVariable("id") Long id,
                                                                 @RequestBody DocketReasonRequest docketReasonRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(docketReasonService.save(id, docketReasonRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocketReason(@PathVariable("id") Long id) {
        docketReasonService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteDocketReasons(@RequestBody List<Long> ids) {
        docketReasonService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}