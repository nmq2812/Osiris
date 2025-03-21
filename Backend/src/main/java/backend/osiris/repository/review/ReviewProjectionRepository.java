package backend.osiris.repository.review;

import backend.osiris.dto.statitic.StatisticResource;
import backend.osiris.entity.review.Review;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@AllArgsConstructor
public class ReviewProjectionRepository {

    private EntityManager em;

    public List<StatisticResource> getReviewCountByCreateDate() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<StatisticResource> query = cb.createQuery(StatisticResource.class);

        Root<Review> review = query.from(Review.class);
        query.select(cb.construct(StatisticResource.class, review.get("createdAt").as(Instant.class), cb.count(review.get("id"))));
        query.groupBy(review.get("createdAt").as(Instant.class));
        query.orderBy(cb.asc(review.get("createdAt")));

        return em.createQuery(query).getResultList();
    }

}
