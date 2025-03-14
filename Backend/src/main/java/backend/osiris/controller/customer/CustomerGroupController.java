package backend.osiris.controller.customer;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.customer.CustomerGroupRequest;
import backend.osiris.dto.customer.CustomerGroupResponse;
import backend.osiris.service.customer.CustomerGroupService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-groups")
@AllArgsConstructor
public class CustomerGroupController {

    private CustomerGroupService customerGroupService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllCustomerGroups(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(customerGroupService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerGroupResponse> getCustomerGroup(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(customerGroupService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerGroupResponse> createCustomerGroup(@RequestBody CustomerGroupRequest customerGroupRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerGroupService.save(customerGroupRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerGroupResponse> updateCustomerGroup(@PathVariable("id") Long id,
                                                               @RequestBody CustomerGroupRequest customerGroupRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(customerGroupService.save(id, customerGroupRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomerGroup(@PathVariable("id") Long id) {
        customerGroupService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteCustomerGroups(@RequestBody List<Long> ids) {
        customerGroupService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}