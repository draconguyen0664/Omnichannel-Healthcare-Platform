import { expect, test } from "@playwright/test";

test("shows the healthcare dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Tổng quan vận hành" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Tạo hồ sơ" })).toBeVisible();
});
