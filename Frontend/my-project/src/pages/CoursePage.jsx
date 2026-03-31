import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ChevronRight, Award, PlayCircle } from 'lucide-react';

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/lessons`)
        ]);
        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
        if (lessonsRes.data.length > 0) {
          setCurrentLesson(lessonsRes.data[0]);
        }
      } catch (err) {
        console.error('Error fetching course data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#04AA6D]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} courses={[]} /> {/* We should ideally fetch all courses for sidebar */}
        
        <main className="flex-1 overflow-y-auto">
          {/* Internal Sidebar (Lesson List) */}
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <div className="p-6 border-b border-gray-200 bg-[#E7F3EF]">
                 <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <Award className="text-[#04AA6D]" size={20} /> {course?.name}
                 </h2>
                 <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-widest">TUTORIAL CONTENT</p>
              </div>
              <div className="py-2">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left px-6 py-4 text-sm font-medium transition-all flex items-center justify-between group ${
                      currentLesson?.id === lesson.id 
                        ? 'bg-white text-[#04AA6D] border-l-4 border-[#04AA6D] shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle size={16} className={currentLesson?.id === lesson.id ? 'text-[#04AA6D]' : 'text-gray-400'} />
                      {lesson.title}
                    </div>
                    <ChevronRight size={14} className={`transition-transform ${currentLesson?.id === lesson.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>

              <div className="mt-10 p-6 border-t border-gray-200">
                <Link 
                  to={`/quiz/${id}`}
                  className="w-full py-4 bg-[#04AA6D] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#059862] transition shadow-lg"
                >
                  <Award size={20} /> START QUIZ
                </Link>
              </div>
            </div>

            {/* Lesson Content Viewer */}
            <div className="flex-1 p-8 md:p-14 overflow-y-auto">
              {currentLesson ? (
                <article className="prose prose-lg max-w-4xl mx-auto prose-green">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-gray-100 leading-tight">
                    {currentLesson.title}
                  </h1>
                  <div className="mt-8 text-gray-700 leading-relaxed space-y-6 text-lg font-medium">
                    {/* Simplified markdown-like rendering */}
                    {currentLesson.content.split('\n').map((line, idx) => {
                      if (line.startsWith('# ')) return <h1 key={idx} className="text-4xl font-bold mt-10 mb-6">{line.replace('# ', '')}</h1>;
                      if (line.startsWith('## ')) return <h2 key={idx} className="text-3xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                      return <p key={idx} className="mb-4">{line}</p>;
                    })}
                  </div>
                  
                  <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                     <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition">PREVIOUS</button>
                     <button className="px-6 py-2.5 bg-[#04AA6D] text-white rounded-lg font-bold hover:bg-[#059862] transition shadow-md">NEXT</button>
                  </div>
                </article>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-bold text-xl uppercase tracking-widest">
                  No lessons found for this course.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePage;
