import { test, expect } from "@playwright/test";

test.describe("Tìm kiếm từ header", () => {
    test("nhập từ khóa và chuyển đến trang kết quả tìm kiếm", async ({
        page,
    }) => {
        // Bắt đầu từ trang chủ
        await page.goto("/");

        // Tìm kiếm input
        const searchInput = page.locator('input[type*="search"]');
        await searchInput.click();
        await searchInput.fill("30mm");

        // Submit form tìm kiếm (Enter)
        await searchInput.press("Enter");

        // Kiểm tra đã chuyển đến trang tìm kiếm
        await expect(page).toHaveURL(/\/search\?q=30mm/);

        // Đợi kết quả hiển thị
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Kiểm tra tiêu đề trang
        const title = page.locator("h2");
        await expect(title).toContainText('Kết quả tìm kiếm cho "30mm"');
    });
});
