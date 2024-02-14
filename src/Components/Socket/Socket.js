import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://talky-backend-dev-hzez.3.us-1.fl0.io/';

export const socket = io(URL, {
    extraHeaders: {
        "authorization": localStorage.getItem("token") || ""
    }
});