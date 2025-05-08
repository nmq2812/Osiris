import { defineConfig, devices } from "@playwright/test";

/**
 * Config cho môi trường production
 */
export default defineConfig({
    testDir: "./tests",
    timeout: 40000, // Tăng timeout cho môi trường production
    expect: { timeout: 10000 }, // Tăng timeout cho assertions
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1, // Thêm retry cho cả local test
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ["html"], // Báo cáo HTML
        ["list"], // Danh sách ngắn gọn
        ["dot"], // Hiển thị dấu chấm cho mỗi test
        ["line"], // Hiển thị từng dòng cho mỗi test
        ["junit", { outputFile: "test-results/junit-report.xml" }], // Xuất báo cáo JUnit
    ],

    use: {
        /* Đổi baseURL thành URL production */
        baseURL: "https://osiris-alpha.vercel.app",

        /* Thiết lập trình duyệt với headers mặc định */
        extraHTTPHeaders: {
            // Nếu cần thiết, thêm headers đặc biệt tại đây
        },

        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "on-first-retry",
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],

    // Bỏ phần webServer vì chúng ta test trên môi trường đã deploy
    // webServer: {
    //   command: "npm run dev",
    //   url: "http://localhost:3000",
    //   reuseExistingServer: !process.env.CI,
    // },
});
