import axiosInstance from "$lib/axios"
import { getToken } from "$lib/token"
import { PUBLIC_TS_EXPRESS_URL } from '$env/static/public';

export const GetUserPointBalance = async (user_id: number) => {
    const token = getToken()
    const response = await axiosInstance.post(`${PUBLIC_TS_EXPRESS_URL}/points/get-points`,
        { user_id }
        , {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
    return response.data
}
