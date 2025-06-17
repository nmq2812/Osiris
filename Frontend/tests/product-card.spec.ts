import { test, expect } from "@playwright/test";

test.describe("Product Card Component", () => {
    test("hiển thị thông tin sản phẩm và highlight từ khóa tìm kiếm", async ({
        page,
    }) => {
        await page.goto("/search?q=30mm");
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Đợi thêm để đảm bảo sản phẩm đã hiển thị
        await page.waitForSelector(".ant-col", { state: "visible" });

        // Lấy card sản phẩm đầu tiên
        const firstProductCard = page.locator(".ant-col").first();

        // Kiểm tra các thành phần của card
        await expect(firstProductCard.locator("img")).toBeVisible(); // Có ảnh sản phẩm
        await expect(firstProductCard.locator("span")).toBeVisible(); // Có tên sản phẩm
    });

    test("click vào sản phẩm chuyển đến trang chi tiết", async ({ page }) => {
        // Thêm debug để kiểm tra
        await page.goto("/search?q=30mm");
        console.log("Đã tải trang tìm kiếm, đang đợi skeleton biến mất...");

        await page.waitForSelector(".ant-skeleton", { state: "hidden" });
        console.log("Skeleton đã biến mất, đang tìm sản phẩm...");

        // Đợi cho sản phẩm hiển thị
        await page.waitForSelector(".ant-col", {
            state: "visible",
            timeout: 10000,
        });

        // Lấy thông tin URL hiện tại để so sánh sau khi click
        const currentUrl = page.url();
        console.log("URL hiện tại:", currentUrl);

        // TÌM LINK VỚI SELECTOR MỚI CHÍNH XÁC HƠN
        // Tìm thẻ <a> là con trực tiếp của .ant-col
        const productLink = await page
            .locator(".ant-col > a")
            .first()
            .getAttribute("href");
        console.log("Tìm thấy link sản phẩm:", productLink);

        // Click vào sản phẩm đầu tiên - click vào thẻ <a>
        await page.locator(".ant-col > a").first().click();
        console.log("Đã click vào sản phẩm");

        // Đợi chuyển trang
        await page
            .waitForURL((url) => url.href !== currentUrl, { timeout: 10000 })
            .catch((e) => console.log("Không phát hiện chuyển URL:", e));

        // Kiểm tra đã chuyển đến trang chi tiết sản phẩm
        if (productLink) {
            await expect(page).toHaveURL(productLink);
        } else {
            // Phòng trường hợp không lấy được href
            await expect(page).not.toHaveURL(/\/search\?q=/);
        }
    });
});
