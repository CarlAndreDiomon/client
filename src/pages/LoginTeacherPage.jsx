// filepath: c:\\Users\\user\\OneDrive\\Desktop\\client\\src\\pages\\LoginTeacherPage.jsx
"use client";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, BookCopyIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LoginTeacherPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", // Assuming teacher login also uses fullName, adjust if different (e.g., email)
    password: "",
  });
  // Destructure new state and function for teacher login
  const { loginTeacher, isLoggingInTeacher } = useAuthStore(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the new loginTeacher function
    loginTeacher(formData); 
  };

  return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2 group mb-6">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <BookCopyIcon className="w-7 h-7 text-black" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">Teacher Portal</h1>
              <p className="text-gray-600 text-sm sm:text-base">Login as Teacher</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Name</span>
              </label>
              
              <div className="relative">
                {/* Mail Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 pr-3 py-2 text-sm sm:text-base"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10 py-2 text-sm sm:text-base"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-black w-full text-sm sm:text-base py-2.5" disabled={isLoggingInTeacher}>
              {isLoggingInTeacher ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Login as Teacher"
              )}
            </button>
            {/* Optional: Link to student login or other pages */}
            <div className="text-center pt-4">
             <p className="text-sm text-gray-600">Not a teacher? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login as Student</Link></p>
            </div>
          </form>
        </div>
      </div>
  );
};
export default LoginTeacherPage;
