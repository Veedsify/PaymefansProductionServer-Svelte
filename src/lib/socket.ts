import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
import { env } from '$env/dynamic/public';

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(env.PUBLIC_TS_EXPRESS_URL_DIRECT as string, {
            autoConnect: false,
        });
        socket.connect();
    }
    return socket;
};
