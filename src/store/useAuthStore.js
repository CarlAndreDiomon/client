import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
        const res = await axiosInstance.get("/admin/checkAdminAuth");
        set({ authUser: res.data });
        } catch (error) {
        if (error.response) {
            console.log("Error response:", error.response);
        } else if (error.request) {
            console.log("No response received:", error.request);
        } else {
            console.log("Error setting up request:", error.message);
        }
        set({ authUser: null });
        } finally {
        set({ isCheckingAuth: false });
        }
    },

    signup: async(data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/registerStudent", data);
            set({ authUser: res.data });
            toast.success("Registration successful");
            
        } catch (error) {
            toast.error("Registration failed");
            console.error("Registration error:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/loginStudent", data);
            set({ authUser: res.data });
            toast.success("Login successful");
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Login error:", error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        } catch (error) {
        toast.error(error.response.data.message);
        }
    },
}));
