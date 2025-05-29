import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Added for localStorage persistence
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({ 
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isLoggingInTeacher: false, // Added for teacher login status
    modules: [],
    isLoadingModules: false,
    isDownloadingModule: false,
    isUploadingFile: false, // Added for upload status

    checkAuth: async () => {
        set({ isCheckingAuth: true }); // Ensure isCheckingAuth is true at the start
        try {
        // Replace with your actual endpoint if different
        const res = await axiosInstance.get("/admin/checkAdminAuth");
        set({ authUser: res.data, isCheckingAuth: false });
        } catch (error) {
        if (error.response) {
            console.log("Error response:", error.response);
        } else if (error.request) {
            console.log("No response received:", error.request);
        } else {
            console.log("Error setting up request:", error.message);
        }
        set({ authUser: null, isCheckingAuth: false }); // Set authUser to null and isCheckingAuth to false on error
        }
        // finally block for isCheckingAuth removed as it's handled in try/catch
    },

    signup: async(data) => {
        set({ isSigningUp: true });
        try {
            // Replace with your actual endpoint
            const res = await axiosInstance.post("/auth/registerStudent", data);
            set({ authUser: res.data });
            toast.success("Registration successful");
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            console.error("Registration error:", error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            // Replace with your actual endpoint
            const res = await axiosInstance.post("/auth/loginStudent", data);
            set({ authUser: res.data });
            toast.success("Login successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            console.error("Login error:", error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        const { authUser, logoutTeacher } = get(); // Get authUser and logoutTeacher action

        if (authUser && authUser.Role === 'teacher') {
            // If the user is a teacher, call the teacher-specific logout
            await logoutTeacher(); 
        } else {
            // Otherwise, perform the standard student logout
            try {
                await axiosInstance.post("/auth/logout"); 
                set({ authUser: null }); 
                toast.success("Logged out successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || "Logout failed");
            }
        }
    },

    logoutTeacher: async () => {
        try {
        // Replace with your actual endpoint
        await axiosInstance.post("/auth/logoutTeacher"); 
        set({ authUser: null }); // This will be persisted, effectively clearing authUser from localStorage
        toast.success("Logged out successfully");
        } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    loginTeacher: async (data) => { // New function for teacher login
        set({ isLoggingInTeacher: true });
        try {
            // Replace with your actual teacher login endpoint
            const res = await axiosInstance.post("/auth/loginTeacher", data); 
            set({ authUser: res.data }); 
            toast.success("Teacher login successful");
        } catch (error) {
            toast.error(error.response?.data?.message || "Teacher login failed");
            console.error("Teacher login error:", error);
        } finally {
            set({ isLoggingInTeacher: false });
        }
    },

    fetchModules: async () => {
        set({ isLoadingModules: true });
        try {
            const res = await axiosInstance.get("/files"); 

            // Check if the response has a 'files' array
            if (res.data && Array.isArray(res.data.files)) {
                const formattedModules = res.data.files.map(file => ({
                    id: file.originalName, // This should be the identifier used for downloading, e.g., originalName
                    name: file.filename || file.originalName, 
                    description: `Subject: ${file.subject || 'N/A'}, Grade: ${file.gradeLevel || 'N/A'}`, // These fields are not in the provided API response, so they'll be N/A
                }));
                set({ modules: formattedModules, isLoadingModules: false });
                if (formattedModules.length > 0) {
                    toast.success(res.data.message || "Modules loaded successfully");
                } else {
                    toast.success("No modules found.");
                }
            } else {
                // Handle cases where response is not as expected
                console.warn(
                    "fetchModules: Expected data.files to be an array, but received:", res.data
                );
                toast.error("Could not load modules: Unexpected format received from server.");
                set({ modules: [], isLoadingModules: false });
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            let userMessage = "Failed to load modules.";

            if (error.response) {
                // Handle specific 404 from backend sending "No files found." string
                if (error.response.status === 404 && typeof error.response.data === 'string' && error.response.data.includes("No files found")) {
                    userMessage = "No modules found.";
                    toast.success(userMessage); // Use success for "no modules"
                } else if (error.response.data && typeof error.response.data.message === 'string') {
                    // If the error response is an object with a message property
                    userMessage = error.response.data.message;
                    toast.error(userMessage);
                } else if (typeof error.response.data === 'string' && error.response.data.length > 0 && error.response.data.length < 150) {
                    // If the error response is a short string (e.g., the HTML error page itself, or a simple text error)
                    userMessage = error.response.data.substring(0,100) + "..."; // Show a snippet
                    toast.error("Error from server: " + userMessage);
                } else {
                    toast.error(userMessage); // Default "Failed to load modules"
                }
            } else {
                // Network error or other issues where error.response is not available
                toast.error(userMessage);
            }
            set({ modules: [], isLoadingModules: false });
        }
    },

    downloadModuleById: async (moduleId, moduleName = 'module_file') => { 
        set({ isDownloadingModule: true });
        const toastId = toast.loading(`Downloading ${moduleName}...`);
        try {
            const res = await axiosInstance.get(`/download/${moduleId}`, { 
                responseType: 'blob', 
            });

            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            let filename = moduleName; 
            const contentDisposition = res.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(;|$)/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }
            
            if (filename === moduleName && blob.type) {
                const extension = blob.type.split('/')[1];
                if (extension && !filename.endsWith(`.${extension}`)) {
                    filename = `${filename}.${extension}`;
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            toast.success(`${filename} download started!`, { id: toastId });
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            set({ isDownloadingModule: false });

        } catch (error) {
            console.error("Error downloading module:", error);
            let errorMsg = "Failed to download module.";
            if (error.response) {
                
                try {
                    const errDataText = await error.response.data.text();
                    const errData = JSON.parse(errDataText);
                    errorMsg = errData.message || errorMsg;
                } catch (parseDetailsError) { // Renamed variable and corrected logic below
                    console.warn("Could not parse detailed error from blob:", parseDetailsError);
                    // Fallback if blob is not JSON or text() fails
                    errorMsg = error.response.statusText || "Failed to retrieve detailed error message."; 
                }
            }
            toast.error(errorMsg, { id: toastId });
            set({ isDownloadingModule: false });
        }
    },

    
    uploadFile: async (formData) => {
        const { authUser } = get(); // Get current authUser to check role

        if (!authUser || authUser.Role !== 'teacher') {
            toast.error("Unauthorized: Only teachers can upload files.");
            return; // Exit if not a teacher
        }

        set({ isUploadingFile: true });
        const toastId = toast.loading("Uploading file...");
        try {
            
            const res = await axiosInstance.post("/upload", formData, {
                headers: {
                    // Axios will typically set 'Content-Type': 'multipart/form-data' for FormData
                },
            });
            toast.success(res.data.message || "File uploaded successfully!", { id: toastId });
            // set({ isUploadingFile: false }); // Moved to finally
            get().fetchModules(); // Enabled auto-refresh
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error(error.response?.data?.message || "Failed to upload file.", { id: toastId });
            // set({ isUploadingFile: false }); // Moved to finally
        } finally {
            set({ isUploadingFile: false }); // Ensure isUploadingFile is reset
        }
    },
}),
    {
      name: 'auth-user-storage', // Name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({ authUser: state.authUser }), // Only persist the authUser field
      // onRehydrateStorage can be used for actions after state is loaded, if needed
    }
  )
);
