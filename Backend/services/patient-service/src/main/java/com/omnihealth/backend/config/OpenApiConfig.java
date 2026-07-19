package com.omnihealth.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI omniHealthOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Omni Health API")
                .version("v1")
                .description("Backend APIs for Web Admin, Patient App and Doctor App"));
    }
}
