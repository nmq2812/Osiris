package backend.osiris.dto.waybill;

import backend.osiris.entity.waybill.RequiredNote;
import backend.osiris.utils.DefaultInstantDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import org.springframework.lang.Nullable;

import java.time.Instant;

@Data
public class WaybillRequest {
    private Long orderId;
    @JsonDeserialize(using = DefaultInstantDeserializer.class)
    private Instant shippingDate;
    private Integer weight;
    private Integer length;
    private Integer width;
    private Integer height;
    @Nullable
    private String note;
    private RequiredNote ghnRequiredNote;
}
