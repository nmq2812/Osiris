package backend.osiris.controller.customer;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerResourceRequest;
import backend.osiris.dto.customer.CustomerResourceResponse;
import backend.osiris.service.customer.CustomerResourceService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-resources")
@AllArgsConstructor
public class CustomerResourceController {

    private CustomerResourceService customerResourceService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllCustomerResources(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(customerResourceService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResourceResponse> getCustomerResource(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(customerResourceService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerResourceResponse> createCustomerResource(@RequestBody CustomerResourceRequest customerResourceRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerResourceService.save(customerResourceRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResourceResponse> updateCustomerResource(@PathVariable("id") Long id,
                                                                     @RequestBody CustomerResourceRequest customerResourceRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(customerResourceService.save(id, customerResourceRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomerResource(@PathVariable("id") Long id) {
        customerResourceService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCustomerResources(@RequestBody List<Long> ids) {
        customerResourceService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}