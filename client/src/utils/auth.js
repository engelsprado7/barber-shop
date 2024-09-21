// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

// Function to get the token from local storage
const getToken = () => {

    return localStorage.getItem('token');

};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    console.log('token', token);
    if (!token) return false;

    try {
        // Decode the token and check expiration
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token is expired
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
};

// Function to log out the user by removing the token
export const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
};

// Function to get user information from the token
export const getUserInfo = () => {
    const token = getToken();
    if (token) {
        return jwtDecode(token);
    }
    return null;
};
