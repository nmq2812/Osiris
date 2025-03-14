package backend.osiris.controller.customer;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerStatusRequest;
import backend.osiris.dto.customer.CustomerStatusResponse;
import backend.osiris.service.customer.CustomerStatusService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-status")
@AllArgsConstructor
public class CustomerStatusController {

    private CustomerStatusService customerStatusService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllCustomerStatuss(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(customerStatusService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerStatusResponse> getCustomerStatus(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(customerStatusService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerStatusResponse> createCustomerStatus(@RequestBody CustomerStatusRequest customerStatusRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerStatusService.save(customerStatusRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerStatusResponse> updateCustomerStatus(@PathVariable("id") Long id,
                                                                     @RequestBody CustomerStatusRequest customerStatusRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(customerStatusService.save(id, customerStatusRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomerStatus(@PathVariable("id") Long id) {
        customerStatusService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCustomerStatuss(@RequestBody List<Long> ids) {
        customerStatusService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}