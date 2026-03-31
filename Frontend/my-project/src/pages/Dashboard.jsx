import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BookOpen, Award, Clock, ArrowRight, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, resultsRes] = await Promise.all([
          api.get('/courses/'),
          api.get('/quiz/results')
        ]);
        setCourses(coursesRes.data);
        setResults(resultsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#04AA6D]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} courses={courses} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-500 font-medium">Welcome back, {user?.name}! Track your learning and quiz progress here.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-50 text-[#04AA6D] rounded-xl">
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{results.length}</div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Quizzes Taken</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Available Courses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Results */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Recent Quiz Results</h2>
                  <Link to="/quiz" className="text-[#04AA6D] text-sm font-bold hover:underline">Take More Quizzes</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {results.length > 0 ? (
                    results.map((result) => (
                      <div key={result.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${result.percentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            <Award size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{result.course_name} Quiz</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <Clock size={12} /> {new Date(result.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-extrabold ${result.percentage >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                            {result.percentage}%
                          </div>
                          <div className="text-xs text-gray-400 font-medium">Score: {result.score}/{result.total_questions}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-gray-500">
                        <p>No quiz results yet. Start learning today!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Courses */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Explore Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6 text-gray-700">
                     <Book size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">{course.description}</p>
                  <Link 
                    to={`/course/${course.id}`}
                    className="flex items-center gap-1 text-[#04AA6D] font-bold text-sm hover:gap-2 transition-all"
                  >
                    View Lessons <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
