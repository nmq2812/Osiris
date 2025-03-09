package backend.osiris.controller.address;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.address.WardRequest;
import backend.osiris.dto.address.WardResponse;
import backend.osiris.service.address.WardService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wards")
@AllArgsConstructor
public class WardController {

    private WardService wardService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllWards(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(wardService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WardResponse> getWard(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(wardService.findById(id));
    }

    @PostMapping
    public ResponseEntity<WardResponse> createWard(@RequestBody WardRequest wardRequestt) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wardService.save(wardRequestt));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WardResponse> updateWard(@PathVariable("id") Long id,
                                                           @RequestBody WardRequest wardRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(wardService.save(id, wardRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWard(@PathVariable("id") Long id) {
        wardService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteWards(@RequestBody List<Long> ids) {
        wardService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}