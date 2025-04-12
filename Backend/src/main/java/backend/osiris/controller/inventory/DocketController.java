package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.DocketRequest;
import backend.osiris.dto.inventory.DocketResponse;
import backend.osiris.service.inventory.DocketService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dockets")
@AllArgsConstructor
public class DocketController {

    private DocketService docketService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllDockets(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(docketService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocketResponse> getDocket(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(docketService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DocketResponse> createDocket(@RequestBody DocketRequest docketRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(docketService.save(docketRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocketResponse> updateDocket(@PathVariable("id") Long id,
                                                     @RequestBody DocketRequest docketRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(docketService.save(id, docketRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocket(@PathVariable("id") Long id) {
        docketService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteDockets(@RequestBody List<Long> ids) {
        docketService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}