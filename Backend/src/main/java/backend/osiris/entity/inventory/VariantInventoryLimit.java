package backend.osiris.entity.inventory;

import backend.osiris.entity.BaseEntity;
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
@Table(name = "variant_inventory_limit")
public class VariantInventoryLimit extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", referencedColumnName = "id", nullable = false, unique = true)
    @MapsId
    private Variant variant;

    @Column(name = "minimum_limit")
    private Integer minimumLimit;

    @Column(name = "maximum_limit")
    private Integer maximumLimit;
}