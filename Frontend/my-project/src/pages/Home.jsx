import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, ChevronRight, ChevronLeft, Code, Award, BookOpen, Users, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Language config with W3Schools-style colors
const LANGUAGES = [
  { name: 'HTML',       color: '#D9534F', bg: '#F9E8E8' },
  { name: 'CSS',        color: '#5B9BD5', bg: '#E8F0FA' },
  { name: 'JavaScript', color: '#F0DB4F', bg: '#FDF8E4', textColor: '#333' },
  { name: 'Python',     color: '#306998', bg: '#E5EDF5' },
  { name: 'SQL',        color: '#E97B00', bg: '#FDF0E0' },
];

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };
    fetchCourses();
  }, []);

  const handleLanguageClick = (courseName) => {
    const course = courses.find(c => c.name.toLowerCase() === courseName.toLowerCase());
    if (course) {
      if (user) {
        navigate(`/quiz/${course.id}`);
      } else {
        navigate('/login');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const match = courses.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (match) {
      if (user) {
        navigate(`/quiz/${match.id}`);
      } else {
        navigate('/login');
      }
    }
  };

  const scrollBar = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Language Bar - W3Schools style */}
      <div className="w-full bg-[#282A35] relative">
        <div className="flex items-center max-w-7xl mx-auto">
          <button 
            onClick={() => scrollBar(-1)} 
            className="p-2 text-gray-400 hover:text-white transition shrink-0 hidden md:block"
          >
            <ChevronLeft size={18} />
          </button>
          <div 
            ref={scrollRef}
            className="flex items-center overflow-x-auto scrollbar-hide gap-0 flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.name}
                onClick={() => handleLanguageClick(lang.name)}
                className="px-5 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-[#3b3d4a] transition-all whitespace-nowrap tracking-wide uppercase shrink-0"
              >
                {lang.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => scrollBar(1)} 
            className="p-2 text-gray-400 hover:text-white transition shrink-0 hidden md:block"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#282A35] text-white pt-16 pb-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Learn to Code
            </h1>
            <p className="text-xl md:text-2xl text-green-400 font-semibold mb-12">
              With the world's largest web developer site.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex mb-10">
              <input 
                type="text" 
                placeholder="Search our tutorials, e.g. HTML" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3.5 px-6 rounded-l-full text-gray-800 text-base bg-white border-2 border-r-0 border-white focus:outline-none placeholder-gray-400"
                style={{ boxShadow: 'none' }}
              />
              <button 
                type="submit"
                className="bg-[#04AA6D] hover:bg-[#059862] text-white px-6 rounded-r-full transition font-bold flex items-center gap-1 border-2 border-[#04AA6D]"
              >
                <Search size={20} />
              </button>
            </form>

            <Link to="/signup" className="text-lg underline hover:text-green-400 transition font-bold tracking-wide">
              Not Sure Where To Begin?
            </Link>
          </div>
        </section>

        {/* Language Cards Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LANGUAGES.map((lang) => {
                const course = courses.find(c => c.name.toLowerCase() === lang.name.toLowerCase());
                return (
                  <div 
                    key={lang.name}
                    onClick={() => handleLanguageClick(lang.name)}
                    className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                    style={{ background: `linear-gradient(135deg, ${lang.bg} 0%, white 100%)` }}
                  >
                    <div className="p-8">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white font-extrabold text-xl shadow-lg"
                        style={{ backgroundColor: lang.color }}
                      >
                        {lang.name.charAt(0)}
                      </div>
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-[#04AA6D] transition">
                        {lang.name}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm mb-6">
                        {course?.description || `Learn ${lang.name} with interactive quizzes`}
                      </p>
                      <div 
                        className="inline-flex items-center gap-2 font-bold text-sm py-2 px-4 rounded-full transition-all group-hover:gap-3"
                        style={{ color: lang.color, backgroundColor: lang.bg }}
                      >
                        Take Quiz <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Get Started Card */}
              <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-gradient-to-br from-green-50 to-white flex flex-col justify-center items-center p-8 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-[#04AA6D] text-white shadow-lg">
                  <Zap size={28} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Explore All</h3>
                <p className="text-gray-500 font-medium text-sm mb-6">Browse all courses and track your progress</p>
                <Link 
                  to={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 font-bold text-sm py-2 px-4 rounded-full bg-green-100 text-[#04AA6D] hover:gap-3 transition-all"
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#282A35] py-12 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">5+</div>
              <div className="text-green-400 text-sm font-bold uppercase tracking-widest">Languages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">25+</div>
              <div className="text-green-400 text-sm font-bold uppercase tracking-widest">Quiz Questions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">Free</div>
              <div className="text-green-400 text-sm font-bold uppercase tracking-widest">Forever</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">∞</div>
              <div className="text-green-400 text-sm font-bold uppercase tracking-widest">Retries</div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500 font-medium">Three simple steps to test your coding knowledge</p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Code size={32} />
              </div>
              <h3 className="text-xl font-extrabold mb-3">1. Pick a Language</h3>
              <p className="text-gray-500 font-medium">Choose from HTML, CSS, JavaScript, Python, or SQL</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-extrabold mb-3">2. Take the Quiz</h3>
              <p className="text-gray-500 font-medium">Answer multiple-choice questions to test your skills</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-[#04AA6D] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-extrabold mb-3">3. Get Your Score</h3>
              <p className="text-gray-500 font-medium">See your results instantly and track progress on your dashboard</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#E7F3EF] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Ready to Test Your Skills?</h2>
            <p className="text-xl text-gray-600 mb-10 font-medium">Pick a language, take the quiz, and see how you score. It's free!</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="px-8 py-3.5 bg-[#04AA6D] text-white rounded-full font-bold text-lg hover:bg-[#059862] transition shadow-lg hover:shadow-xl">
                Get Started for Free
              </Link>
              <Link to="/login" className="px-8 py-3.5 bg-white text-gray-800 border-2 border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition">
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#282A35] text-white py-10 px-6 text-center border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="text-green-500 font-extrabold text-2xl">W3</span>
            <span className="font-bold text-xl">Schools</span>
          </div>
          <p className="text-gray-500 font-medium text-sm">Quiz Platform — Built with FastAPI & React</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
