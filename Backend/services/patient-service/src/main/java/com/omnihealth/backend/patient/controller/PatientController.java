package com.omnihealth.backend.patient.controller;

import com.omnihealth.backend.patient.dto.PatientRequest;
import com.omnihealth.backend.patient.dto.PatientResponse;
import com.omnihealth.backend.patient.service.PatientService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientController {
    private final PatientService service;

    public PatientController(PatientService service) { this.service = service; }

    @GetMapping
    @Operation(summary = "List patients")
    List<PatientResponse> findAll() { return service.findAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a patient")
    PatientResponse create(@Valid @RequestBody PatientRequest request) {
        return service.create(request);
    }
}
