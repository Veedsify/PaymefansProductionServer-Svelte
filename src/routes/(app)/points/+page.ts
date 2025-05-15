import ROUTE from '$lib/config/routes';
import type { PageLoad } from './$types';


export const load: PageLoad = async () => {
    async function FetchRates() {
        try {
            const response = await fetch(ROUTE.GET_PLATFROM_EXCHANGE_RATE);
            if (!response.ok) {
                throw new Error("Failed to fetch exchange rates");
            }
            const data = await response.json();
            if (data.data.length > 0) {
                return data.data
            }
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    };

    return {
        rates: await FetchRates()
    }
};