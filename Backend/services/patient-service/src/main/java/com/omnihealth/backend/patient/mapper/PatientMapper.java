package com.omnihealth.backend.patient.mapper;

import com.omnihealth.backend.patient.dto.PatientRequest;
import com.omnihealth.backend.patient.dto.PatientResponse;
import com.omnihealth.backend.patient.entity.Patient;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Patient toEntity(PatientRequest request);
    PatientResponse toResponse(Patient patient);
}
