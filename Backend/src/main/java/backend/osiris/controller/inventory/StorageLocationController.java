package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.StorageLocationRequest;
import backend.osiris.dto.inventory.StorageLocationResponse;
import backend.osiris.service.inventory.StorageLocationService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage_locations")
@AllArgsConstructor
public class StorageLocationController {

    private StorageLocationService storageLocationService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllStorageLocations(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(storageLocationService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StorageLocationResponse> getStorageLocation(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(storageLocationService.findById(id));
    }

    @PostMapping
    public ResponseEntity<StorageLocationResponse> createStorageLocation(@RequestBody StorageLocationRequest storageLocationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storageLocationService.save(storageLocationRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StorageLocationResponse> updateStorageLocation(@PathVariable("id") Long id,
                                                     @RequestBody StorageLocationRequest storageLocationRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(storageLocationService.save(id, storageLocationRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStorageLocation(@PathVariable("id") Long id) {
        storageLocationService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteStorageLocations(@RequestBody List<Long> ids) {
        storageLocationService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}