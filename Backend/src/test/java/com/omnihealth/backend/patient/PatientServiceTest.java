package com.omnihealth.backend.patient;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {
    @Mock PatientRepository repository;
    @Mock PatientMapper mapper;
    @Mock RabbitTemplate rabbitTemplate;
    PatientService service;

    @BeforeEach
    void setUp() {
        service = new PatientService(repository, mapper, rabbitTemplate, "patient.created");
    }

    @Test
    void rejectsDuplicateEmail() {
        var request = new PatientRequest("Nguyen An", "an@example.com", null);
        when(repository.existsByEmail(request.email())).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> service.create(request));
    }
}
