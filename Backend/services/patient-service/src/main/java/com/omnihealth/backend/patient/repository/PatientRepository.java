package com.omnihealth.backend.patient.repository;

import com.omnihealth.backend.patient.entity.Patient;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByEmail(String email);
}
