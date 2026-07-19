import { describe, expect, it } from "vitest";
import { patientSchema } from "@/lib/patient-schema";

describe("patientSchema", () => {
  it("accepts a valid patient", () => {
    expect(
      patientSchema.safeParse({ name: "Nguyễn An", email: "an@example.com" })
        .success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(patientSchema.safeParse({ name: "Nguyễn An", email: "invalid" }).success).toBe(false);
  });
});
