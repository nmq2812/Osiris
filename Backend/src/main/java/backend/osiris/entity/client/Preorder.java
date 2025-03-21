package backend.osiris.entity.client;

import backend.osiris.entity.BaseEntity;
import backend.osiris.entity.authentication.User;
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
@Table(name = "preorder", uniqueConstraints = @UniqueConstraint(name = "uc_preorder", columnNames = {"user_id", "product_id"}))
public class Preorder extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "status", nullable = false, columnDefinition = "TINYINT")
    private Integer status;
}