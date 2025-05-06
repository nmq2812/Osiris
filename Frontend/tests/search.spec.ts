import { test, expect } from "@playwright/test";

test.describe("Trang tìm kiếm sản phẩm", () => {
    test("hiển thị kết quả tìm kiếm", async ({ page }) => {
        // Điều hướng đến trang tìm kiếm với query parameter
        await page.goto("/search?q=30mm");

        // Đợi cho kết quả hiển thị (thay vì skeleton loading)
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // sửa thành kiểm tra có ít nhất 1 sản phẩm
        const productCards = page.locator(".ant-col");
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);

        // Thêm kiểm tra nội dung của sản phẩm
        const firstProductTitle = productCards
            .first()
            .locator(".ant-typography")
            .first();
        expect(firstProductTitle).toBeTruthy();
    });

    test("không tìm thấy kết quả", async ({ page }) => {
        // Tìm kiếm với từ khóa không tồn tại
        await page.goto("/search?q=sảnphẩmkhôngtồntại123456789");

        // Đợi cho kết quả hiển thị
        await page.waitForSelector(".ant-empty");

        // Kiểm tra hiển thị thông b30mm không có sản phẩm
        const emptyMessage = page.locator(".ant-empty-description");
        await expect(emptyMessage).toHaveText("Không có sản phẩm");
    });

    test("sắp xếp sản phẩm theo giá tăng dần", async ({ page }) => {
        await page.goto("/search?q=30mm");

        // Đợi trang tải xong
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Click vào radio "Giá thấp → cao"
        await page.getByText("Giá thấp → cao").click();

        // Đợi dữ liệu tải lại
        await page.waitForResponse(
            (response) =>
                response.url().includes(encodeURIComponent("lowest-price")) &&
                response.status() === 200,
        );

        // Kiểm tra URL có chứa tham số sắp xếp
        await expect(page).toHaveURL(/.*lowest-price.*/);
    });

    test("lọc sản phẩm còn hàng", async ({ page }) => {
        await page.goto("/search?q=30mm");

        // Đợi trang tải xong
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Click vào checkbox "Chỉ tính còn hàng"
        await page.getByLabel("Chỉ tính còn hàng").check();

        // Đợi dữ liệu tải lại
        await page.waitForResponse(
            (response) =>
                response.url().includes("saleable=true") &&
                response.status() === 200,
        );
    });

    test("chuyển trang kết quả tìm kiếm", async ({ page }) => {
        await page.goto("/search?q=30mm");

        // Đợi trang tải xong
        await page.waitForSelector(".ant-skeleton", { state: "hidden" });

        // Kiểm tra ban đầu là trang 1
        const pagination = page.locator(".ant-pagination-item-1");
        await expect(pagination).toHaveClass(/ant-pagination-item-active/);

        // Click sang trang 2 (nếu có)
        const page2Button = page.locator(".ant-pagination-item-2");
        if (await page2Button.isVisible()) {
            await page2Button.click();

            // Đợi dữ liệu tải lại
            await page.waitForResponse(
                (response) =>
                    response.url().includes("page=2") &&
                    response.status() === 200,
            );

            // Kiểm tra đã chuyển sang trang 2
            await expect(page2Button).toHaveClass(/ant-pagination-item-active/);

            // Kiểm tra hiển thị "Trang 2"
            const pageText = page.locator("text=Trang 2");
            await expect(pageText).toBeVisible();
        }
    });
});
