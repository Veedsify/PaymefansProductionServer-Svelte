import { goto } from "$app/navigation"

export const getToken = (): string => {
    const cookies = document?.cookie || "";
    const tokenPart = cookies.split("token=")[1];
    const token = tokenPart ? tokenPart.split(";")[0] : "";
    if (!token) {
        goto("/login");
        return ""; // Ensure a string is always returned
    }
    return token;
}