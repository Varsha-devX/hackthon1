import { Link, useLocation } from 'react-router-dom';
import { Home, Book, FileText, Settings, Award, Layers } from 'lucide-react';

const Sidebar = ({ isOpen, courses = [] }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Dashboard', icon: Layers, path: '/dashboard' },
    { name: 'Quizzes', icon: Award, path: '/quiz' },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 h-screen overflow-y-auto`}>
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-800 uppercase tracking-widest text-sm">
        <MenuIcon className="text-gray-400" /> Navigation
      </div>
      
      <div className="py-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              location.pathname === item.path 
                ? 'bg-[#E7F3EF] text-[#04AA6D] border-r-4 border-[#04AA6D]' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-4 p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-4 px-2">
          COURSES
        </div>
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
              location.pathname === `/course/${course.id}`
                ? 'bg-[#E7F3EF] text-[#04AA6D]'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <FileText size={16} />
            {course.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};

const MenuIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export default Sidebar;
