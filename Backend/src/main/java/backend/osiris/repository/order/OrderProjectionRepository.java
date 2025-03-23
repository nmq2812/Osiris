package backend.osiris.repository.order;

import backend.osiris.dto.statitic.StatisticResource;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@AllArgsConstructor
public class OrderProjectionRepository {

    private EntityManager em;

    public List<StatisticResource> getOrderCountByCreateDate() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<StatisticResource> query = cb.createQuery(StatisticResource.class);

        Root<Order> order = query.from(Order.class);
        query.select(cb.construct(StatisticResource.class, order.get("createdAt").as(Instant.class), cb.count(order.get("id"))));
        query.groupBy(order.get("createdAt").as(Instant.class));
        query.orderBy(cb.asc(order.get("createdAt")));

        return em.createQuery(query).getResultList();
    }

}
