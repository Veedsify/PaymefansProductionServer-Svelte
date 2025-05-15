type StoreProduct = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    instock: number;
    product_id: string;
    category: {
        name: string;
    };
    images: {
        id: number;
        image_url: string;
    }[];
    sizes: {
        size: {
            name: string;
        };
    }[];
};

type StoreAllProductsResponse = {
    error: boolean;
    message: string;
    totalProducts: number;
    hasMore: boolean;
    perPage: number;
    data: StoreProduct[];
}