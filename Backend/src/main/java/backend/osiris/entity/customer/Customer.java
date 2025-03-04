package backend.osiris.entity.customer;

import backend.osiris.entity.BaseEntity;
import backend.osiris.entity.authentication.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "customer")
public class Customer extends BaseEntity {
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_group_id", nullable = false)
    @JsonBackReference
    private CustomerGroup customerGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_status_id", nullable = false)
    @JsonBackReference
    private CustomerStatus customerStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_resource_id", nullable = false)
    @JsonBackReference
    private CustomerResource customerResource;
}