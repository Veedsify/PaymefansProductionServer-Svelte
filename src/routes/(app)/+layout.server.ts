import type { LayoutServerLoad } from './$types';
import type { AuthUserProps } from '../../types/user';
import { PUBLIC_TS_EXPRESS_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';
import axios from 'axios';
export const load: LayoutServerLoad = async ({ cookies }) => {
    async function retrieveUserData() {
        const token = cookies.get('token');
        try {
            const response = await axios.get(`${PUBLIC_TS_EXPRESS_URL}/auth/retrieve`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                return redirect(200, '/login');
            }

            const data = response.data;
            if (data?.user) {
                return data.user as AuthUserProps;
            }

        } catch (error: any) {
            cookies.delete('token', {
                expires: new Date(0),
                path: '/',
            });
            redirect(307, '/login');
        }
    }
    const user = await retrieveUserData();
    return {
        user,
    };
};