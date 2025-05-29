import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SideBar from './components/SideBar';
import UploadPage from './pages/UploadPage';
import DownloadPage from './pages/DownloadPage'; // Import DownloadPage
import LoginTeacherPage from './pages/LoginTeacherPage'; // Import LoginTeacherPage

function App() {
  const { authUser, checkAuth, isCheckingAuth, logout } = useAuthStore();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Sidebar as overlay */}
      {authUser && (
        <SideBar
          showMenu={showSidebar}
          toggleMenu={() => setShowSidebar(prev => !prev)}
          logout={logout}
        />
      )}

      {/* Main Content */}
      <div className="h-full w-full  bg-gray-400 overflow-auto">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={authUser ? <HomePage /> : <RegisterPage />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          {/* Add route for LoginTeacherPage */}
          <Route path="/login-teacher" element={!authUser ? <LoginTeacherPage /> : <Navigate to="/" />} />
          {/* Add route for DownloadPage */}
          <Route path="/download" element={authUser ? <DownloadPage /> : <Navigate to="/login" />} />
          {/* Add route for UploadPage - ensure it's protected if needed */}
          <Route path="/upload" element={authUser && authUser.Role === 'teacher' ? <UploadPage /> : <Navigate to="/" />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}
export default App;