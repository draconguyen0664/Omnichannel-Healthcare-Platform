package com.omnihealth.backend.patient.service;

import com.omnihealth.backend.patient.dto.PatientRequest;
import com.omnihealth.backend.patient.dto.PatientResponse;
import com.omnihealth.backend.patient.mapper.PatientMapper;
import com.omnihealth.backend.patient.repository.PatientRepository;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository repository;
    private final PatientMapper mapper;
    private final RabbitTemplate rabbitTemplate;
    private final String queue;

    public PatientService(PatientRepository repository, PatientMapper mapper,
                          RabbitTemplate rabbitTemplate,
                          @Value("${app.messaging.patient-created-queue}") String queue) {
        this.repository = repository;
        this.mapper = mapper;
        this.rabbitTemplate = rabbitTemplate;
        this.queue = queue;
    }

    @Transactional(readOnly = true)
    @Cacheable("patients")
    public List<PatientResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Transactional
    @CacheEvict(value = "patients", allEntries = true)
    public PatientResponse create(PatientRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        var response = mapper.toResponse(repository.save(mapper.toEntity(request)));
        rabbitTemplate.convertAndSend(queue, response);
        return response;
    }
}
