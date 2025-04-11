package backend.osiris.controller.order;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.order.OrderRequest;
import backend.osiris.dto.order.OrderResponse;
import backend.osiris.dto.order.OrderRequest;
import backend.osiris.dto.order.OrderResponse;
import backend.osiris.service.order.OrderService;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
@CrossOrigin(AppConstants.FRONTEND_HOST)
public class OrderController {

    private OrderService orderService;

    @PutMapping("/cancel/{code}")
    public ResponseEntity<ObjectNode> cancelOrder(@PathVariable String code) {
        orderService.cancelOrder(code);
        return ResponseEntity.status(HttpStatus.OK).body(new ObjectNode(JsonNodeFactory.instance));
    }

    @GetMapping
    public ResponseEntity<ListResponse> getAllOrders(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.save(orderRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable("id") Long id,
                                                                                         @RequestBody OrderRequest orderRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.save(id, orderRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long id) {
        orderService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteOrders(@RequestBody List<Long> ids) {
        orderService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
