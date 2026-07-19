import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  email: z.email("Email không hợp lệ"),
});

export type PatientInput = z.infer<typeof patientSchema>;
