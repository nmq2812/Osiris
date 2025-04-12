package backend.osiris.controller.promotion;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.promotion.PromotionRequest;
import backend.osiris.dto.promotion.PromotionResponse;
import backend.osiris.dto.promotion.PromotionCheckingResponse;
import backend.osiris.service.promotion.PromotionService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@AllArgsConstructor
@CrossOrigin(AppConstants.FRONTEND_HOST)
public class PromotionController {

    private PromotionService promotionService;

    @GetMapping("/checking")
    public ResponseEntity<PromotionCheckingResponse> checkCanCreatePromotionForProduct(
            @RequestParam Long productId,
            @RequestParam Instant startDate,
            @RequestParam Instant endDate
    ) {
        boolean promotionable = promotionService.checkCanCreatePromotionForProduct(productId, startDate, endDate);
        return ResponseEntity.status(HttpStatus.OK).body(new PromotionCheckingResponse(promotionable));
    }

    @GetMapping
    public ResponseEntity<ListResponse> getAllPromotions(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(promotionService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponse> getPromotion(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(promotionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PromotionResponse> createPromotion(@RequestBody PromotionRequest promotionRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.save(promotionRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponse> updatePromotion(@PathVariable("id") Long id,
                                                             @RequestBody PromotionRequest promotionRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(promotionService.save(id, promotionRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable("id") Long id) {
        promotionService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletePromotions(@RequestBody List<Long> ids) {
        promotionService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
