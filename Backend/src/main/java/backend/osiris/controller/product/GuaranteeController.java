package backend.osiris.controller.product;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.product.GuaranteeRequest;
import backend.osiris.dto.product.GuaranteeResponse;
import backend.osiris.service.product.GuaranteeService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guarantees")
@AllArgsConstructor
public class GuaranteeController {

    private GuaranteeService guaranteeService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllGuarantees(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(guaranteeService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuaranteeResponse> getGuarantee(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(guaranteeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GuaranteeResponse> createGuarantee(@RequestBody GuaranteeRequest guaranteeRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(guaranteeService.save(guaranteeRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuaranteeResponse> updateGuarantee(@PathVariable("id") Long id,
                                                 @RequestBody GuaranteeRequest guaranteeRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(guaranteeService.save(id, guaranteeRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuarantee(@PathVariable("id") Long id) {
        guaranteeService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteGuarantees(@RequestBody List<Long> ids) {
        guaranteeService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}