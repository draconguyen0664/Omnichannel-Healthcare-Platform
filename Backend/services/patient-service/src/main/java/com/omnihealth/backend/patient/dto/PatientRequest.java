package com.omnihealth.backend.patient.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PatientRequest(
        @NotBlank @Size(max = 150) String fullName,
        @NotBlank @Email @Size(max = 190) String email,
        @Size(max = 30) String phone) {
}
