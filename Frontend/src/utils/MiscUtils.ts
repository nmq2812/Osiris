import { ClientCategoryResponse } from "@/datas/ClientUI";

class MiscUtils {
    static pick = <T>(o: T, arr: string[]) => {
        const result = {};

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Object.entries(o).forEach(([k, v]) => {
            if (arr.includes(k)) {
                Object.assign(result, { [k]: v });
            }
        });

        return result;
    };

    static isEquals = <T1, T2>(first: T1, second: T2) => isEqual(first, second);

    static convertToSlug = (name: string) =>
        name
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .replace(/đ/g, "d")
            .replace(/ /g, "-")
            .concat("-", Math.random().toString(36).substring(2, 7));

    static formatPrice = (price: number): string =>
        new Intl.NumberFormat("vi-VN").format(price);

    static recursiveFlatMap = (arrays: any[][]): string[][] => {
        // Xử lý đầu vào
        if (!arrays || arrays.length === 0) return [[]];

        // Đảm bảo tất cả phần tử đều là mảng hợp lệ
        const validArrays = arrays
            .map((arr) => (Array.isArray(arr) ? arr : []))
            .filter((arr) => arr.length > 0);

        if (validArrays.length === 0) return [[]];

        // Triển khai tổ hợp mà không cần dùng flatMap
        function combine(index: number, current: any[] = []): any[][] {
            if (index === validArrays.length) {
                return [current];
            }

            const results: any[][] = [];
            for (const value of validArrays[index]) {
                const newCombinations = combine(index + 1, [...current, value]);
                results.push(...newCombinations);
            }
            return results;
        }

        return combine(0);
    };

    static parserPrice = (value?: string) => (value || "").replace(/(\.)/g, "");

    static formatterPrice = (value?: string) =>
        !Number.isNaN(parseFloat(value || ""))
            ? (value || "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            : "";

    static makeCategoryBreadcrumbs = (
        category: ClientCategoryResponse,
    ): ClientCategoryResponse[] => {
        if (!category.categoryParent) {
            return [category];
        }
        return [
            ...MiscUtils.makeCategoryBreadcrumbs(category.categoryParent),
            category,
        ];
    };

    static generatePriceOptions = (filterPriceQuartiles: [number, number]) => {
        const start = filterPriceQuartiles[0];
        const end = filterPriceQuartiles[1];

        let step = 100_000;

        if (end - start >= 10_000_000) {
            step = 10_000_000;
        }

        const prices = [];

        for (let i = start; i <= end; i += step) {
            prices.push(i);
        }

        const priceOptions: string[][] = [];

        for (let i = 0; i <= prices.length; i++) {
            if (i === 0) {
                priceOptions.push(["0", String(prices[0])]);
            } else if (i === prices.length) {
                priceOptions.push([String(prices[prices.length - 1]), "max"]);
            } else {
                priceOptions.push([String(prices[i - 1]), String(prices[i])]);
            }
        }

        return priceOptions;
    };

    static readablePriceOption = (priceOption: string[]) => {
        const replaceMillion = (price: string) =>
            price.replace(/000000$/, " tr");

        if (priceOption[0] === "0") {
            return "Dưới " + replaceMillion(priceOption[1]);
        } else if (priceOption[1] === "max") {
            return "Trên " + replaceMillion(priceOption[0]);
        }

        return (
            replaceMillion(priceOption[0]) +
            " đến " +
            replaceMillion(priceOption[1])
        );
    };

    // eslint-disable-next-line no-console
    static console = console;

    static ghnLogoPath =
        "https://file.hstatic.net/200000472237/file/logo_b8515d08a6d14b09bce4e39221712e15.png";

    static calculateDiscountedPrice = (price: number, discount: number) =>
        (price * (100 - discount)) / 100;
}

export default MiscUtils;

function isEqual<T1, T2>(first: T1, second: T2) {
    return JSON.stringify(first) === JSON.stringify(second);
}
