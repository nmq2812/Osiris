import {
    ClientCategoryResponse,
    ClientListedProductResponse,
} from "@/datas/ClientUI";
import { MessageResponse } from "@/models/Message";

class MockUtils {
    static featuredCategories: ClientCategoryResponse[] = [
        {
            categoryName: "Model Kit",
            categorySlug: "Model Kit",
            categoryChildren: [],
        },
        {
            categoryName: "Metal Build",
            categorySlug: "Metal Build",
            categoryChildren: [],
        },
        {
            categoryName: "Figure",
            categorySlug: "figure",
            categoryChildren: [],
        },
        {
            categoryName: "Dụng cụ",
            categorySlug: "Dụng cụ",
            categoryChildren: [],
        },
        {
            categoryName: "Phụ kiện",
            categorySlug: "Phụ kiện",
            categoryChildren: [],
        },
    ];

    static allCategories: ClientCategoryResponse[] = [
        {
            categoryName: "Model Kit",
            categorySlug: "Model Kit",
            categoryChildren: [],
        },
        {
            categoryName: "Metal Build",
            categorySlug: "Metal Build",
            categoryChildren: [],
        },
        {
            categoryName: "Figure",
            categorySlug: "figure",
            categoryChildren: [],
        },
        {
            categoryName: "Dụng cụ",
            categorySlug: "Dụng cụ",
            categoryChildren: [],
        },
        {
            categoryName: "Phụ kiện",
            categorySlug: "Phụ kiện",
            categoryChildren: [],
        },
    ];

    static sampleCategory: ClientCategoryResponse = {
        categoryName: "MG Gundam",
        categorySlug: "mg-gundam",
        categoryChildren: [
            {
                categoryName: "MG tỉ lệ 1:144",
                categorySlug: "mg-gundam-144",
                categoryChildren: [],
            },
        ],
        categoryParent: {
            categoryName: "Gundam",
            categorySlug: "gundam",
            categoryChildren: [],
        },
    };

    static sampleProduct: ClientListedProductResponse = {
        productId: 1,
        productName: "Lenovo Legion 5 Pro 2022",
        productSlug: "lenovo-legion-5-pro-2022",
        productThumbnail: "https://dummyimage.com/400x400/e8e8e8/6e6e6e.png",
        productPriceRange: [10_000_000, 12_000_000],
        productVariants: [],
        productSaleable: true,
        productPromotion: {
            promotionId: 1,
            promotionPercent: 10,
        },
    };

    static sampleMessages: MessageResponse[] = [
        {
            id: 2,
            createdAt: "",
            updatedAt: "",
            content: "This is a content",
            status: 1,
            user: {
                id: 1,
                username: "dtreat3",
                fullname: "Admin",
                email: "",
            },
        },
        {
            id: 1,
            createdAt: "",
            updatedAt: "",
            content: "This is a content",
            status: 1,
            user: {
                id: 4,
                username: "dtreat3",
                fullname: "Daniel",
                email: "",
            },
        },
    ];
}

export default MockUtils;
