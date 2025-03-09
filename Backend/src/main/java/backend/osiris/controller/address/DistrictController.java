package backend.osiris.controller.address;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.address.DistrictRequest;
import backend.osiris.dto.address.DistrictResponse;
import backend.osiris.service.address.DistrictService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
@AllArgsConstructor
public class DistrictController {

    private DistrictService districtService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllDistricts(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(districtService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DistrictResponse> getDistrict(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(districtService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DistrictResponse> createDistrict(@RequestBody DistrictRequest districtRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(districtService.save(districtRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DistrictResponse> updateDistrict(@PathVariable("id") Long id,
                                                           @RequestBody DistrictRequest districtRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(districtService.save(id, districtRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistrict(@PathVariable("id") Long id) {
        districtService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteDistricts(@RequestBody List<Long> ids) {
        districtService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}