package backend.osiris.controller.inventory;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.inventory.DestinationRequest;
import backend.osiris.dto.inventory.DestinationResponse;
import backend.osiris.service.inventory.DestinationService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@AllArgsConstructor
public class DestinationController {

    private DestinationService destinationService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllDestinations(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(destinationService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponse> getDestination(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(destinationService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DestinationResponse> createDestination(@RequestBody DestinationRequest destinationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(destinationService.save(destinationRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DestinationResponse> updateDestination(@PathVariable("id") Long id,
                                                             @RequestBody DestinationRequest destinationRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(destinationService.save(id, destinationRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable("id") Long id) {
        destinationService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteDestinations(@RequestBody List<Long> ids) {
        destinationService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}