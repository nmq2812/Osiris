package backend.osiris.dto.general;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EventInitiationResponse {
    private String eventSourceUuid;
}