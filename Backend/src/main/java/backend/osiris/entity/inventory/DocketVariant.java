package backend.osiris.entity.inventory;

import backend.osiris.entity.product.Variant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "docket_variant")
public class DocketVariant {
    @EmbeddedId
    private DocketVariantKey docketVariantKey = new DocketVariantKey();

    @ManyToOne
    @MapsId("docketId")
    @JoinColumn(name = "docket_id", nullable = false)
    private Docket docket;

    @ManyToOne
    @MapsId("variantId")
    @JoinColumn(name = "variant_id", nullable = false)
    private Variant variant;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}