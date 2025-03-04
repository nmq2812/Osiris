package backend.osiris.entity.inventory;

import backend.osiris.entity.BaseEntity;
import backend.osiris.entity.product.Product;
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
@Table(name = "product_inventory_limit")
public class ProductInventoryLimit extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false, unique = true)
    @MapsId
    private Product product;

    @Column(name = "minimum_limit")
    private Integer minimumLimit;

    @Column(name = "maximum_limit")
    private Integer maximumLimit;
}