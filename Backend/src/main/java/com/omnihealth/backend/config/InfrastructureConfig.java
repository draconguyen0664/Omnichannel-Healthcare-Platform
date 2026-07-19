package com.omnihealth.backend.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@EnableCaching
public class InfrastructureConfig {
    @Bean
    Queue patientCreatedQueue(@Value("${app.messaging.patient-created-queue}") String name) {
        return new Queue(name, true);
    }

    @Bean
    CircuitBreaker downstreamCircuitBreaker() {
        var config = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(10))
                .slidingWindowSize(10)
                .build();
        return CircuitBreaker.of("downstream-api", config);
    }
}
