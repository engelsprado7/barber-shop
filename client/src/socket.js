import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

let URL = ''
if (import.meta.env.MODE === 'development') {
    console.log('development')
    URL = import.meta.env.PUBLIC_URL_API_BACKEND
} else {
    URL = import.meta.env.PUBLIC_URL_API_BACKEND
}


export const socket = io(URL);