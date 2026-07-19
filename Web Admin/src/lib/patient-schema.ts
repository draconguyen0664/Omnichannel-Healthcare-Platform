import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Nhập ít nhất 2 ký tự"),
  email: z.email("Email không hợp lệ"),
});

export type PatientInput = z.infer<typeof patientSchema>;
