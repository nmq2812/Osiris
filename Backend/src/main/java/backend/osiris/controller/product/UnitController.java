package backend.osiris.controller.product;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.UnitRequest;
import backend.osiris.dto.product.UnitResponse;
import backend.osiris.service.product.UnitService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@AllArgsConstructor
public class UnitController {

    private UnitService unitService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllUnits(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(unitService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnitResponse> getUnit(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(unitService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UnitResponse> createUnit(@RequestBody UnitRequest unitRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unitService.save(unitRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnitResponse> updateUnit(@PathVariable("id") Long id,
                                                 @RequestBody UnitRequest unitRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(unitService.save(id, unitRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnit(@PathVariable("id") Long id) {
        unitService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUnits(@RequestBody List<Long> ids) {
        unitService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}