import { describe, expect, it } from "vitest";
import { parseRealtimeMessage } from "@/lib/realtime-message";

describe("parseRealtimeMessage", () => {
  it("parses a valid WebSocket notification", () => {
    expect(
      parseRealtimeMessage(
        JSON.stringify({ type: "notification", message: "Có lịch hẹn mới" }),
      ),
    ).toEqual({ type: "notification", message: "Có lịch hẹn mới" });
  });

  it("ignores malformed payloads", () => {
    expect(parseRealtimeMessage("not-json")).toBeNull();
    expect(parseRealtimeMessage(JSON.stringify({ type: "notification" }))).toBeNull();
  });
});
