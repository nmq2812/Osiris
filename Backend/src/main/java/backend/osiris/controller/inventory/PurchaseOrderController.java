package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.PurchaseOrderRequest;
import backend.osiris.dto.inventory.PurchaseOrderResponse;
import backend.osiris.service.inventory.PurchaseOrderService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase_orders")
@AllArgsConstructor
public class PurchaseOrderController {

    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllPurchaseOrders(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(purchaseOrderService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> getPurchaseOrder(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(purchaseOrderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(@RequestBody PurchaseOrderRequest purchaseOrderRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseOrderService.save(purchaseOrderRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> updatePurchaseOrder(@PathVariable("id") Long id,
                                                     @RequestBody PurchaseOrderRequest purchaseOrderRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(purchaseOrderService.save(id, purchaseOrderRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable("id") Long id) {
        purchaseOrderService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletePurchaseOrders(@RequestBody List<Long> ids) {
        purchaseOrderService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}