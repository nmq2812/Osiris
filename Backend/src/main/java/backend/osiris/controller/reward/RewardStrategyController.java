package backend.osiris.controller.reward;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.ListResponse;
import backend.osiris.dto.reward.RewardStrategyRequest;
import backend.osiris.dto.reward.RewardStrategyResponse;
import backend.osiris.service.reward.RewardStrategyService;
import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewardStrategys")
@AllArgsConstructor
public class RewardStrategyController {

    private RewardStrategyService rewardStrategyService;

    @GetMapping
    public ResponseEntity<ListResponse> getAllRewardStrategys(
            @RequestParam(name = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(name = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(name = "sort", defaultValue = AppConstants.DEFAULT_SORT) String sort,
            @RequestParam(name = "filter", required = false) @Nullable String filter,
            @RequestParam(name = "search", required = false) @Nullable String search,
            @RequestParam(name = "all", required = false) boolean all
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(rewardStrategyService.findAll(page, size, sort, filter, search, all));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RewardStrategyResponse> getRewardStrategy(@PathVariable("id") Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(rewardStrategyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RewardStrategyResponse> createRewardStrategy(@RequestBody RewardStrategyRequest rewardStrategyRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rewardStrategyService.save(rewardStrategyRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RewardStrategyResponse> updateRewardStrategy(@PathVariable("id") Long id,
                                                   @RequestBody RewardStrategyRequest rewardStrategyRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(rewardStrategyService.save(id, rewardStrategyRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRewardStrategy(@PathVariable("id") Long id) {
        rewardStrategyService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRewardStrategys(@RequestBody List<Long> ids) {
        rewardStrategyService.delete(ids);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}