package backend.osiris.controller.statistic;

import backend.osiris.constant.AppConstants;
import backend.osiris.dto.statistic.StatisticResponse;
import backend.osiris.service.statistic.StatisticService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@AllArgsConstructor
public class StatisticController {

    private StatisticService statisticService;

    @GetMapping
    public ResponseEntity<StatisticResponse> getStatistic() {
        // TODO: Chưa rõ API này có lấy thống kê theo 7 ngày gần nhất?
        return ResponseEntity.status(HttpStatus.OK).body(statisticService.getStatistic());
    }

}
