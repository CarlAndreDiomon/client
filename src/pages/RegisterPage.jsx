import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import {BookCopyIcon, Eye, EyeOff, Loader2, Lock, Mail, NutIcon, User} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const RegisterPageTeacher = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();
    
    const validateForm = () => {
      if (!formData.fullName.trim()) return toast.error("Full name is required");
      if (!formData.email.trim()) return toast.error("Email is required");
      if (!formData.gradeLevel.trim()) return toast.error("Gradee is required");
      if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
      if (!formData.password.trim()) return toast.error("Password is required");
      if (formData.password.length < 6) return toast.error("password must be at least 6 characters");

      return true;
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const success = validateForm();

      if (success == true) signup(formData);
    };


  return (


      <div className="h-screen flex justify-center items-center p-6">
        <div className="sm:w-screen md:w-96 lg:w-2/3 xl:w-1/3 h-fullspace-y-8 shadow-lg shadow-gray-600 bg-white p-2 rounded-lg">
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'> 
              <div className='size-12 rounded-xl bg-primary/10 flex items-center 
              justify-center group-hover:bg-primary/20 transition-colors'
              >
                 <BookCopyIcon className="w-6 h-6 text-black" />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create Teacher Account</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Full Name</span>
            </label>
            <div className='relative'> 
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                <User className='size-5 text-base-content/40'/>
              </div>
              <input
                type='text'
                className={`input input-bordered w-full pl-10`}
                placeholder='John Doe'
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Grade Level</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                <NutIcon className='size-5 text-base-content/40'/>
              </div>
              <input 
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder='you@example.com'
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value})} 
              />
            </div>
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text font-medium'>Email</span>
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                <Mail className='size-5 text-base-content/40'/>
              </div>
              <input 
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder='you@example.com'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className='form-control'> 
            <label className='label'>
              <span className='label-text font-medium'>Password</span>
            </label>
          </div>  
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
              <Lock className='size-5 text-base-content/40'/>
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              className={`input input-bordered w-full pl-10`}
              placeholder='••••••••'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className='size-5 text-base-content/40' />
              ) : (
                <Eye className='size-5 text-base-content/40'/>
              )}
            </button>
          </div>

          <button type='submit' className='btn btn-black w-full' disabled={isSigningUp}>
            {isSigningUp ? (
              <>
                <Loader2 className='size-5 animate-spin'/>
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <div className='text-center p-5'>
            <h1>Have An Account Already?<Link to="/login" className="text-blue-700">Login Now!</Link></h1>
          </div>
          </form>

        </div>
      </div>
  )
}

export default RegisterPageTeacher