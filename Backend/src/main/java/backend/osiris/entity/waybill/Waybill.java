package backend.osiris.entity.waybill;

import backend.osiris.entity.BaseEntity;
import backend.osiris.entity.order.Order;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "waybill")
public class Waybill extends BaseEntity {
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", nullable = false, unique = true)
    private Order order;

    @Column(name = "shipping_date", nullable = false, updatable = false)
    private Instant shippingDate;

    @Column(name = "expected_delivery_time", nullable = false)
    private Instant expectedDeliveryTime;

    @Column(name = "status", nullable = false, columnDefinition = "TINYINT")
    private Integer status;

    @Column(name = "cod_amount", nullable = false)
    private Integer codAmount;

    @Column(name = "shipping_fee", nullable = false)
    private Integer shippingFee;

    @Column(name = "weight", nullable = false)
    private Integer weight;

    @Column(name = "length", nullable = false)
    private Integer length;

    @Column(name = "width", nullable = false)
    private Integer width;

    @Column(name = "height", nullable = false)
    private Integer height;

    @Column(name = "note")
    private String note;

    @Column(name = "ghn_payment_type_id", nullable = false)
    private Integer ghnPaymentTypeId;

    @Column(name = "ghn_required_note", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequiredNote ghnRequiredNote;

    @OneToMany(mappedBy = "waybill", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WaybillLog> waybillLogs = new ArrayList<>();
}