package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.WarehouseRequest;
import backend.osiris.dto.inventory.WarehouseResponse;
import backend.osiris.service.inventory.WarehouseService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@AllArgsConstructor
public class WarehouseController {

    private WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllWarehouses(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(warehouseService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseResponse> getWarehouse(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(warehouseService.findById(id));
    }

    @PostMapping
    public ResponseEntity<WarehouseResponse> createWarehouse(@RequestBody WarehouseRequest warehouseRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.save(warehouseRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WarehouseResponse> updateWarehouse(@PathVariable("id") Long id,
                                                                                     @RequestBody WarehouseRequest warehouseRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(warehouseService.save(id, warehouseRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable("id") Long id) {
        warehouseService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteWarehouses(@RequestBody List<Long> ids) {
        warehouseService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}