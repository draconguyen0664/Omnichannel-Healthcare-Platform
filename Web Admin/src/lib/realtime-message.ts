import { z } from "zod";

const realtimeMessageSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  title: z.string().optional(),
  message: z.string(),
});

export type RealtimeMessage = z.infer<typeof realtimeMessageSchema>;

export function parseRealtimeMessage(data: unknown): RealtimeMessage | null {
  try {
    const value = typeof data === "string" ? JSON.parse(data) : data;
    const result = realtimeMessageSchema.safeParse(value);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
