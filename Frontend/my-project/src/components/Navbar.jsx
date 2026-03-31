import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#212121] text-white px-4 py-2 sticky top-0 z-50 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-1 hover:bg-[#333] rounded lg:hidden"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-1 font-bold text-2xl tracking-tighter">
          <span className="text-green-500 font-extrabold text-3xl">W3</span>
          <span>Schools</span>
          <span className="text-green-400 font-normal text-sm ml-1 self-end mb-1">Clone</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-300">Hi, {user.name}</span>
            <Link to="/dashboard" className="px-4 py-1.5 rounded-full bg-gray-700 text-white text-sm font-bold hover:bg-gray-600 transition">Dashboard</Link>
            <Link to="/dashboard" className="p-1.5 bg-[#4CAF50] rounded-full hover:bg-[#45a049] transition">
              <User size={18} />
            </Link>
            <button 
              onClick={logout}
              className="px-3 py-1 bg-gray-700 rounded text-xs font-semibold hover:bg-gray-600 transition flex items-center gap-1"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="px-4 py-1.5 rounded-full text-gray-300 text-sm font-bold hover:text-white transition hidden sm:block">Dashboard</Link>
            <Link to="/login" className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition">Login</Link>
            <Link to="/signup" className="px-4 py-1.5 rounded-full bg-[#04AA6D] text-white text-sm font-bold hover:bg-[#059862] transition">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
