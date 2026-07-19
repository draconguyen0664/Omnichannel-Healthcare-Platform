package com.omnihealth.backend.patient;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Patient toEntity(PatientRequest request);
    PatientResponse toResponse(Patient patient);
}
