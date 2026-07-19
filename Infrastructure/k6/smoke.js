import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "15s", target: 5 },
    { duration: "30s", target: 20 },
    { duration: "15s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL || "http://host.docker.internal:8080";
  const response = http.get(`${baseUrl}/actuator/health`);
  check(response, { "health is 200": (result) => result.status === 200 });
  sleep(1);
}
