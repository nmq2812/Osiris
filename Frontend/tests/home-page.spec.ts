import { test, expect } from "@playwright/test";

test.describe("Kiểm thử Trang Chủ", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("tải trang chủ chính xác", async ({ page }) => {
        // Kiểm tra tiêu đề trang
        await expect(page).toHaveTitle(/Osiris/);

        // Kiểm tra nội dung chính hiển thị
        await expect(page.locator(".ant-layout-content")).toBeVisible();
    });

    test("hiển thị phần banner", async ({ page }) => {
        // Kiểm tra banner tồn tại
        const banner = page.locator('div[style*="background-image"]').first();
        await expect(banner).toBeVisible();

        // Kiểm tra điều hướng băng chuyền hoạt động nếu tồn tại
        const carouselDots = page.locator(".slick-dots");
        if ((await carouselDots.count()) > 0) {
            await expect(carouselDots).toBeVisible();
        }
    });

    test("hiển thị phần danh mục nổi bật", async ({ page }) => {
        // Kiểm tra phần danh mục tồn tại
        const categoriesSection = page.getByText(/Danh mục nổi bật/i);
        await expect(categoriesSection).toBeVisible();

        // Kiểm tra các mục danh mục được tải
        const categoryItems = page.locator(".ant-card");
        const count = await categoryItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test("hiển thị phần sản phẩm mới nhất", async ({ page }) => {
        // Kiểm tra phần sản phẩm mới nhất tồn tại
        const latestProducts = page
            .locator("span")
            .filter({ hasText: /^Sản phẩm mới nhất$/ });
        await expect(latestProducts).toBeVisible();

        // Kiểm tra sản phẩm được tải
        const products = page.locator(".ant-card");
        const count = await products.count();
        expect(count).toBeGreaterThan(0);
    });

    test("hiển thị phần sản phẩm bán chạy", async ({ page }) => {
        // Kiểm tra phần sản phẩm bán chạy tồn tại
        const hotProducts = page.getByText(/Sản phẩm bán chạy/i);
        await expect(hotProducts).toBeVisible();
    });

    test("hiển thị widget chat", async ({ page }) => {
        // Kiểm tra widget chat tồn tại
        const chatWidget = page.locator('div[class*="chat-widget"]');
        await expect(chatWidget).toBeVisible();
    });

    test("điều hướng đến chi tiết sản phẩm khi nhấp vào sản phẩm", async ({
        page,
    }) => {
        // Tìm thẻ sản phẩm và nhấp vào nó
        const productCard = page.locator(".ant-card").first();
        await productCard.click();

        // Kiểm tra điều hướng đến trang chi tiết sản phẩm
        await expect(page).toHaveURL(/\/product\//);
    });
});
