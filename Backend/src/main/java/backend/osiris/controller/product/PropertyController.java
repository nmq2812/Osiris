package backend.osiris.controller.product;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.PropertyRequest;
import backend.osiris.dto.product.PropertyResponse;
import backend.osiris.service.product.PropertyService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@AllArgsConstructor
public class PropertyController {

    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllProperties(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getProperty(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(@RequestBody PropertyRequest propertyRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.save(propertyRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(@PathVariable("id") Long id,
                                                           @RequestBody PropertyRequest propertyRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(propertyService.save(id, propertyRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable("id") Long id) {
        propertyService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProperties(@RequestBody List<Long> ids) {
        propertyService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}