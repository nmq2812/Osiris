package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.TransferRequest;
import backend.osiris.dto.inventory.TransferResponse;
import backend.osiris.service.inventory.TransferService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@AllArgsConstructor
public class TransferController {

    private TransferService transferService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllTransfers(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(transferService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferResponse> getTransfer(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(transferService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TransferResponse> createTransfer(@RequestBody TransferRequest transferRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transferService.save(transferRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransferResponse> updateTransfer(@PathVariable("id") Long id,
                                                     @RequestBody TransferRequest transferRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(transferService.save(id, transferRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransfer(@PathVariable("id") Long id) {
        transferService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteTransfers(@RequestBody List<Long> ids) {
        transferService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}