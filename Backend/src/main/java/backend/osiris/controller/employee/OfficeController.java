package backend.osiris.controller.employee;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.employee.OfficeRequest;
import backend.osiris.dto.employee.OfficeResponse;
import backend.osiris.service.employee.OfficeService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offices")
@AllArgsConstructor
public class OfficeController {

    private OfficeService officeService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllOffices(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(officeService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfficeResponse> getOffice(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(officeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OfficeResponse> createOffice(@RequestBody OfficeRequest officeRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(officeService.save(officeRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfficeResponse> updateOffice(@PathVariable("id") Long id,
                                                   @RequestBody OfficeRequest officeRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(officeService.save(id, officeRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffice(@PathVariable("id") Long id) {
        officeService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteOffices(@RequestBody List<Long> ids) {
        officeService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}