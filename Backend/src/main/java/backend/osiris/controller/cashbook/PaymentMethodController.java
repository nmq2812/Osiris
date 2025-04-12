package backend.osiris.controller.cashbook;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.cashbook.PaymentMethodRequest;
import backend.osiris.dto.cashbook.PaymentMethodResponse;
import backend.osiris.service.cashbook.PaymentMethodService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paymentMethods")
@AllArgsConstructor
public class PaymentMethodController {

    private PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllPaymentMethods(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(paymentMethodService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethod(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(paymentMethodService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PaymentMethodResponse> createPaymentMethod(@RequestBody PaymentMethodRequest paymentMethodRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMethodService.save(paymentMethodRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> updatePaymentMethod(@PathVariable("id") Long id,
                                                     @RequestBody PaymentMethodRequest paymentMethodRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(paymentMethodService.save(id, paymentMethodRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable("id") Long id) {
        paymentMethodService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletePaymentMethods(@RequestBody List<Long> ids) {
        paymentMethodService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}