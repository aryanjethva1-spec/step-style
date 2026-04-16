import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const userInfo = localStorage.getItem('userInfo');
            const brandInfo = localStorage.getItem('brandInfo');

            if (userInfo) {
                try {
                    const { data } = await api.get('/auth/profile');
                    setUser(data);
                } catch (error) {
                    console.error('Session expired', error);
                    localStorage.removeItem('userInfo');
                }
            }
            if (brandInfo) {
                try {
                    const { data } = await api.get('/brand/auth/profile');
                    setBrand(data);
                } catch (error) {
                    console.error('Brand session expired', error);
                    localStorage.removeItem('brandInfo');
                }
            }
            setLoading(false);
        };
        verifyAuth();
    }, []);

    const loginUser = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const registerUser = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const registerWithOTP = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const sendOTP = async (email) => {
        try {
            const url = `${api.defaults.baseURL}/otp/send-otp`;
            console.log(`[AuthContext] Sending OTP to: ${email} via ${url}`);
            const { data } = await api.post('/otp/send-otp', { email });
            return { success: true, message: data.message };
        } catch (error) {
            console.error('[AuthContext] sendOTP Error:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to send OTP';
            return { success: false, message: msg };
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/otp/verify-otp', { email, otp });
            return { success: true, message: data.message };
        } catch (error) {
            console.error('[AuthContext] verifyOTP Error:', error);
            const msg = error.response?.data?.message || error.message || 'OTP verification failed';
            return { success: false, message: msg };
        }
    };

    const logoutUser = async () => {
        try {
            await api.get('/auth/logout');
            setUser(null);
            localStorage.removeItem('userInfo');
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const loginBrand = async (email, password) => {
        try {
            const { data } = await api.post('/brand/auth/login', { email, password });
            setBrand(data);
            localStorage.setItem('brandInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const registerBrand = async (brandData) => {
        try {
            const { data } = await api.post('/brand/auth/register', brandData);
            setBrand(data);
            localStorage.setItem('brandInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logoutBrand = async () => {
        try {
            await api.get('/brand/auth/logout');
            setBrand(null);
            localStorage.removeItem('brandInfo');
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const forgotPassword = async (email, isBrand) => {
        try {
            console.log(`[AuthContext] Forgot Password for: ${email}, isBrand: ${isBrand}`);
            const path = isBrand ? '/brand/auth/forgot-password' : '/auth/forgot-password';
            const { data } = await api.post(path, { email });
            return { success: true, message: data.message };
        } catch (error) {
            console.error('[AuthContext] forgotPassword Error:', error);
            const msg = error.response?.data?.message || error.message || 'Verification failed';
            return { success: false, message: msg };
        }
    };

    const sendResetOTP = async (email) => {
        try {
            console.log(`[AuthContext] Sending Reset OTP to: ${email}`);
            await api.post('/otp/send-reset-otp', { email });
            return { success: true };
        } catch (error) {
            console.error('[AuthContext] sendResetOTP Error:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to send reset code';
            return { success: false, message: msg };
        }
    };

    const resetPassword = async (email, otp, newPassword, isBrand) => {
        try {
            const path = isBrand ? '/brand/auth/reset-password' : '/auth/reset-password';
            const { data } = await api.post(path, { email, otp, newPassword });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Password reset failed' };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await api.put('/auth/profile', profileData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            brand,
            loading,
            loginUser,
            registerUser,
            registerWithOTP,
            sendOTP,
            verifyOTP,
            logoutUser,
            loginBrand,
            registerBrand,
            logoutBrand,
            forgotPassword,
            sendResetOTP,
            resetPassword,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
