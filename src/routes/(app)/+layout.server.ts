import type { LayoutServerLoad } from './$types';
import type { AuthUserProps } from '../../types/user';
import { PUBLIC_TS_EXPRESS_URL } from '$env/static/public';
export const load: LayoutServerLoad = async ({ cookies }) => {
    async function retrieveUserData() {
        const token = cookies.get('token');
        try {
            const response = await fetch(`${PUBLIC_TS_EXPRESS_URL}/auth/retrieve`, {
                method: 'GET',
                cache: "default",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data?.user) {
                    return data.user as AuthUserProps;
                }
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
    }
    const user = await retrieveUserData();
    return {
        user,
    };
};