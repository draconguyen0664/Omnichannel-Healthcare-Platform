package com.omnihealth.backend.patient.dto;

import java.time.Instant;

public record PatientResponse(Long id, String fullName, String email, String phone, Instant createdAt) {
}
