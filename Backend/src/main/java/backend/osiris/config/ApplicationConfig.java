package backend.osiris.config;

import io.github.perplexhub.rsql.RSQLCommonSupport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.time.Instant;

@Configuration
public class ApplicationConfig {

    @Bean
    public RSQLCommonSupport rsqlConfiguration(@Lazy RSQLCommonSupport rsqlCommonSupport) {
        RSQLCommonSupport.addConverter(Instant.class, s -> {
            try {
                return Instant.parse(s);
            } catch (Exception e) {
                return null;
            }
        });
        return rsqlCommonSupport;
    }

}