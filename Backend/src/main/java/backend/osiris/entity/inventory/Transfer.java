package backend.osiris.entity.inventory;

import backend.osiris.entity.BaseEntity;
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
@Table(name = "transfer")
public class Transfer extends BaseEntity {
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "export_docket_id", referencedColumnName = "id", nullable = false, unique = true)
    private Docket exportDocket;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "import_docket_id", referencedColumnName = "id", nullable = false, unique = true)
    private Docket importDocket;

    @Column(name = "note")
    private String note;
}