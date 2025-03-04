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
@Table(name = "count_variant")
public class CountVariant {
    @EmbeddedId
    private CountVariantKey countVariantKey = new CountVariantKey();

    @ManyToOne
    @MapsId("countId")
    @JoinColumn(name = "count_id", nullable = false)
    private Count count;

    @ManyToOne
    @MapsId("variantId")
    @JoinColumn(name = "variant_id", nullable = false)
    private Variant variant;

    @Column(name = "inventory", nullable = false)
    private Integer inventory;

    @Column(name = "actual_inventory", nullable = false)
    private Integer actualInventory;
}