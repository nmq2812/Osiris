package backend.osiris.entity.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
@Embeddable
public class CountVariantKey implements Serializable {
    @Column(name = "count_id", nullable = false)
    Long countId;

    @Column(name = "variant_id", nullable = false)
    Long variantId;
}