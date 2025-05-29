import { Menu, Power, Home, BookOpen, UserCircle, Upload } from 'lucide-react'; // Added Upload icon
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added Link and useNavigate
import toast from 'react-hot-toast'; // Added toast

const SideBar = () => {
  const [showMenu, setShowMenu] = useState(false); // Default to collapsed
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleUploadClick = () => {
    if (authUser && authUser.Role === 'teacher') {
      navigate('/upload');
    } else {
      toast.error('Unauthorized access');
    }
  };

  const menuItems = [
    { name: 'Home', icon: Home, href: '/' }, // Changed href to /
    { name: 'Modules', icon: BookOpen, href: '#' },
    { name: 'Profile', icon: UserCircle, href: '#' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col bg-gradient-to-b from-sky-600/70 to-indigo-900/80 backdrop-blur-lg text-white z-50 shadow-2xl transition-all duration-300 ease-in-out border-r border-white/10 ${
        showMenu ? 'w-64' : 'w-20' // Adjusted width for expanded and collapsed states
      }`}
    >

      {/* Header: Title / Toggle Button */}
      <div className={`px-3 py-3 flex items-center ${showMenu ? 'justify-between' : 'justify-center'}`}>
        {showMenu && (
          <h1 className="text-xl font-semibold text-white">I Learn</h1>
        )}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Section (Placeholder) */}
      <div className={`px-3 ${showMenu ? 'py-3 my-1 border-t border-b border-white/10' : 'py-2 my-1 flex justify-center'}`}>
        <div className={`flex items-center ${showMenu ? 'space-x-3' : 'flex-col space-y-1'}`}>
          {/* Placeholder Avatar */}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
            {/* You can replace this with an img tag if you have an avatar URL */}
            <UserCircle className="w-6 h-6 text-white/70" />
          </div>
          {showMenu && (
            <div className="mt-1 text-left">
              <p className="font-semibold text-sm text-white">
                {authUser.fullName}
              </p>
              <p className="text-xs text-gray-300/80">My Account</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Heading & Items */}
      <nav className="flex-grow px-2 py-2 space-y-0.5 overflow-y-auto">
        {showMenu && (
          <h2 className="px-2.5 pt-1 pb-2 text-xs font-medium text-gray-300/70 uppercase tracking-wider">
            Menu
          </h2>
        )}
        {menuItems.map((item) => (
          <Link // Changed <a> to <Link>
            key={item.name}
            to={item.href} // Changed href to to
            className={`relative flex items-center p-2.5 rounded-md hover:bg-white/10 transition-colors group ${!showMenu ? 'justify-center' : 'space-x-3'}`}
            title={item.name}
          >
            <item.icon className={`w-5 h-5 text-gray-300 group-hover:text-white transition-colors`} />
            {showMenu && (
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors flex-1">
                {item.name}
              </span>
            )}
          </Link> // Changed <a> to <Link>
        ))}
        {/* Upload Link */}
        <button // Changed to button for onClick handler
            onClick={handleUploadClick}
            className={`relative flex items-center p-2.5 rounded-md hover:bg-white/10 transition-colors group ${!showMenu ? 'justify-center' : 'space-x-3'} w-full`}
            title="Upload"
        >
            <Upload className={`w-5 h-5 text-gray-300 group-hover:text-white transition-colors`} />
            {showMenu && (
              <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors flex-1 text-left">
                Upload
              </span>
            )}
        </button>
      </nav>

      {/* Bottom section: Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            // setShowMenu(false); // Optional: collapse menu on logout
          }}
          className={`w-full py-2 flex items-center gap-3 rounded-md hover:bg-white/10 transition-colors group ${showMenu ? 'justify-start px-1.5' : 'justify-center'}`}
          title="Log Out"
        >
          <Power className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
          {showMenu && <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
