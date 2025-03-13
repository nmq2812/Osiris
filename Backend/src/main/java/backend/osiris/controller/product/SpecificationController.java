package backend.osiris.controller.product;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.SpecificationRequest;
import backend.osiris.dto.product.SpecificationResponse;
import backend.osiris.service.product.SpecificationService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specifications")
@AllArgsConstructor
public class SpecificationController {

    private SpecificationService specificationService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllSpecifications(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(specificationService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecificationResponse> getSpecification(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(specificationService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SpecificationResponse> createSpecification(@RequestBody SpecificationRequest specificationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(specificationService.save(specificationRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecificationResponse> updateSpecification(@PathVariable("id") Long id,
                                                 @RequestBody SpecificationRequest specificationRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(specificationService.save(id, specificationRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecification(@PathVariable("id") Long id) {
        specificationService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteSpecifications(@RequestBody List<Long> ids) {
        specificationService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}