import ROUTE from '$lib/config/routes';
import axios from 'axios';
import type { PageLoad } from './$types';


export const load: PageLoad = async () => {
    const fetchStoreProducts: (page: number) => Promise<StoreAllProductsResponse> = async (page) => {
        try {
            const res = await axios.get(ROUTE.FETCH_STORE_PRODUCTS(page));
            return res.data as StoreAllProductsResponse;
        } catch (error) {
            console.error('Error fetching store products:', error);
            throw new Error('An error occurred while fetching store products. Please try again later.');
        }
    };

    return {
        initialProducts: await fetchStoreProducts(1),
        page: 1
    }
};