package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.VariantInventoryLimitRequest;
import backend.osiris.dto.inventory.VariantInventoryLimitResponse;
import backend.osiris.service.inventory.VariantInventoryLimitService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variant_inventory_limits")
@AllArgsConstructor
public class VariantInventoryLimitController {

    private VariantInventoryLimitService variantInventoryLimitService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllVariantInventoryLimits(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(variantInventoryLimitService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VariantInventoryLimitResponse> getVariantInventoryLimit(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(variantInventoryLimitService.findById(id));
    }

    @PostMapping
    public ResponseEntity<VariantInventoryLimitResponse> createVariantInventoryLimit(@RequestBody VariantInventoryLimitRequest variantInventoryLimitRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(variantInventoryLimitService.save(variantInventoryLimitRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VariantInventoryLimitResponse> updateVariantInventoryLimit(@PathVariable("id") Long id,
                                                                                     @RequestBody VariantInventoryLimitRequest variantInventoryLimitRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(variantInventoryLimitService.save(id, variantInventoryLimitRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariantInventoryLimit(@PathVariable("id") Long id) {
        variantInventoryLimitService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteVariantInventoryLimits(@RequestBody List<Long> ids) {
        variantInventoryLimitService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}