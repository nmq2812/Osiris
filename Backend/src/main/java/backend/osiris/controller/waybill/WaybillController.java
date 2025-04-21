package backend.osiris.controller.waybill;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.order.OrderRequest;
import backend.osiris.dto.order.OrderResponse;
import backend.osiris.dto.waybill.GhnCallbackOrderRequest;
import backend.osiris.dto.waybill.WaybillRequest;
import backend.osiris.dto.waybill.WaybillResponse;
import backend.osiris.service.waybill.WaybillService;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waybills")
@AllArgsConstructor
public class WaybillController {

    private WaybillService waybillService;

    @PutMapping("/callback-ghn")
    public ResponseEntity<ObjectNode> callbackStatusWaybillFromGHN(@RequestBody GhnCallbackOrderRequest ghnCallbackOrderRequest) {
        waybillService.callbackStatusWaybillFromGHN(ghnCallbackOrderRequest);
        return ResponseEntity.status(HttpStatus.OK).body(new ObjectNode(JsonNodeFactory.instance));
    }

    @GetMapping
    public ResponseEntity<ListResponse> getAllWaybills(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(waybillService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WaybillResponse> getWaybill(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(waybillService.findById(id));
    }

    @PostMapping
    public ResponseEntity<WaybillResponse> createWaybill(@RequestBody WaybillRequest waybillRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(waybillService.save(waybillRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WaybillResponse> updateWaybill(@PathVariable("id") Long id,
                                                     @RequestBody WaybillRequest waybillRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(waybillService.save(id, waybillRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWaybill(@PathVariable("id") Long id) {
        waybillService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteWaybills(@RequestBody List<Long> ids) {
        waybillService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
