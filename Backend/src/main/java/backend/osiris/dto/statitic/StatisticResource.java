package backend.osiris.dto.statitic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticResource {
    private Instant date;
    private Long total;
}