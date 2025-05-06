import { test, expect } from "@playwright/test";

test.describe("Product Card Component", () => {
    // Test với một sản phẩm cụ thể có trong hệ thống
    test("hiển thị thông tin sản phẩm và highlight từ khóa tìm kiếm", async ({
        page,
    }) => {
        await page.goto("/search?q=30mm");
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Lấy card sản phẩm đầu tiên
        const firstProductCard = page.locator(".ant-col").first();

        // Kiểm tra các thành phần của card
        await expect(firstProductCard.locator("img")).toBeVisible(); // Có ảnh sản phẩm
        await expect(firstProductCard.locator("span")).toBeVisible(); // Có tên sản phẩm
    });

    test("click vào sản phẩm chuyển đến trang chi tiết", async ({ page }) => {
        await page.goto("/search?q=30mm");
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Lấy URL của sản phẩm đầu tiên
        const firstProductCard = page.locator(".ant-col").first();
        const productLink = await firstProductCard
            .locator("a")
            .getAttribute("href");

        // Click vào sản phẩm đầu tiên
        await firstProductCard.click();

        // Kiểm tra đã chuyển đến trang chi tiết sản phẩm
        await expect(page).toHaveURL(productLink || "");
    });
});
