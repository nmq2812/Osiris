package backend.osiris.controller.order;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.order.OrderResourceRequest;
import backend.osiris.dto.order.OrderResourceResponse;
import backend.osiris.service.order.OrderResourceService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order_resources")
@AllArgsConstructor
public class OrderResourceController {

    private OrderResourceService orderResourceService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllOrderResources(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(orderResourceService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResourceResponse> getOrderResource(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(orderResourceService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderResourceResponse> createOrderResource(@RequestBody OrderResourceRequest orderResourceRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResourceService.save(orderResourceRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResourceResponse> updateOrderResource(@PathVariable("id") Long id,
                                                             @RequestBody OrderResourceRequest orderResourceRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(orderResourceService.save(id, orderResourceRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderResource(@PathVariable("id") Long id) {
        orderResourceService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteOrderResources(@RequestBody List<Long> ids) {
        orderResourceService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}