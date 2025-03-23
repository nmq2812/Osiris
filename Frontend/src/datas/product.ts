interface Product {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    code: number;
    slug: string;
    shortDescription: string;
    image: string[];
    category: Category;
    brand: string;
    supplier: Supplier;
    unit: Unit;
    tags: Tag[];
    specifications: {};
    properties: {};
    variants: string[];
    weight: number;
    guarantee: number;
    price: number;
}
