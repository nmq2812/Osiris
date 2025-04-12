package backend.osiris.controller.order;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.order.OrderCancellationReasonRequest;
import backend.osiris.dto.order.OrderCancellationReasonResponse;
import backend.osiris.service.order.OrderCancellationReasonService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order_cancellation_reasons")
@AllArgsConstructor
public class OrderCancellationReasonController {

    private OrderCancellationReasonService orderCancellationReasonService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllOrderCancellationReasons(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(orderCancellationReasonService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderCancellationReasonResponse> getOrderCancellationReason(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(orderCancellationReasonService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderCancellationReasonResponse> createOrderCancellationReason(@RequestBody OrderCancellationReasonRequest orderCancellationReasonRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderCancellationReasonService.save(orderCancellationReasonRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderCancellationReasonResponse> updateOrderCancellationReason(@PathVariable("id") Long id,
                                                                     @RequestBody OrderCancellationReasonRequest orderCancellationReasonRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(orderCancellationReasonService.save(id, orderCancellationReasonRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderCancellationReason(@PathVariable("id") Long id) {
        orderCancellationReasonService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteOrderCancellationReasons(@RequestBody List<Long> ids) {
        orderCancellationReasonService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}