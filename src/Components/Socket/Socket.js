import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://talky-backend.vercel.app/';

export const socket = io(URL, {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "https://talky-gules.vercel.app",
        "authorization": localStorage.getItem("token") || ""
    }
});