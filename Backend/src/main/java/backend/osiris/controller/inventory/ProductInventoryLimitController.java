package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.ProductInventoryLimitRequest;
import backend.osiris.dto.inventory.ProductInventoryLimitResponse;
import backend.osiris.service.inventory.ProductInventoryLimitService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product_inventory_limits")
@AllArgsConstructor
public class ProductInventoryLimitController {

    private ProductInventoryLimitService productInventoryLimitService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllProductInventoryLimits(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(productInventoryLimitService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductInventoryLimitResponse> getProductInventoryLimit(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(productInventoryLimitService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductInventoryLimitResponse> createProductInventoryLimit(@RequestBody ProductInventoryLimitRequest productInventoryLimitRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productInventoryLimitService.save(productInventoryLimitRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductInventoryLimitResponse> updateProductInventoryLimit(@PathVariable("id") Long id,
                                                           @RequestBody ProductInventoryLimitRequest productInventoryLimitRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(productInventoryLimitService.save(id, productInventoryLimitRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductInventoryLimit(@PathVariable("id") Long id) {
        productInventoryLimitService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProductInventoryLimits(@RequestBody List<Long> ids) {
        productInventoryLimitService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}