package backend.osiris.entity.inventory;

import backend.osiris.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "count")
public class Count extends BaseEntity {
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    @JsonBackReference
    private Warehouse warehouse;

    @OneToMany(mappedBy = "count", cascade = CascadeType.ALL)
    private Set<CountVariant> countVariants = new HashSet<>();

    @Column(name = "note")
    private String note;

    @Column(name = "status", nullable = false, columnDefinition = "TINYINT")
    private Integer status;
}