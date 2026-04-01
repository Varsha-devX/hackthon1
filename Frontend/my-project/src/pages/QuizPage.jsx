import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Award, Clock, ArrowRight, Zap, Target, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch course info for the name
        try {
          const courseRes = await api.get(`/courses/${id}`);
          setCourseName(courseRes.data.name);
        } catch (e) {
          // course name is optional
        }
        
        const response = await api.get(`/quiz/${id}`);
        setQuestions(response.data);
      } catch (err) {
        console.error('Error fetching quiz questions', err);
        setError('Could not load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestions();
    } else {
      setLoading(false);
      setError('No quiz selected. Please choose a language from the dashboard.');
    }
  }, [id]);

  const handleStart = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setError('');
  };

  const handleAnswerSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = { question_id: questions[currentIndex].id, answer: option };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    const selectedAnswers = answers.filter((a) => a !== undefined);

    if (!id || isNaN(parseInt(id, 10))) {
      setError('Invalid course ID. Please open the quiz from the course page.');
      return;
    }

    if (selectedAnswers.length === 0) {
      setError('Select at least one answer before submitting.');
      return;
    }

    const timeTaken = startTime ? Math.max(0, Math.floor((Date.now() - startTime) / 1000)) : 0;

    try {
      const response = await api.post('/quiz/submit', {
        course_id: parseInt(id, 10),
        answers: selectedAnswers,
        time_taken: timeTaken,
      });
      setResult(response.data);
      setFinished(true);
    } catch (err) {
      console.error('Error submitting quiz', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Unable to submit quiz. Please check your connection and try again.');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#04AA6D]"></div>
    </div>
  );

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 lg:p-20">
          <div className="max-w-2xl w-full text-center bg-gray-50 p-10 lg:p-16 rounded-3xl border border-gray-100 shadow-xl">
             <div className="w-24 h-24 bg-green-100 text-[#04AA6D] rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                <Target size={48} />
             </div>
             <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
               {courseName ? `${courseName} Quiz` : 'Quiz Assessment'}
             </h1>
             <p className="text-xl text-gray-500 mb-10 font-medium italic">Test your skills and see how much you know!</p>
             
             {error && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-center gap-3 text-red-700 text-left rounded-r-xl">
                 <AlertCircle size={20} />
                 <span className="text-sm font-semibold">{error}</span>
               </div>
             )}
             
             <div className="grid grid-cols-2 gap-6 text-left mb-12">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                   <Clock className="text-blue-500" size={20} />
                   <span className="text-sm font-bold text-gray-700">No Time Limit</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                   <Target className="text-red-500" size={20} />
                   <span className="text-sm font-bold text-gray-700">{questions.length} Questions</span>
                </div>
             </div>

             <button 
                onClick={handleStart}
                disabled={questions.length === 0}
                className="w-full py-5 bg-[#04AA6D] text-white rounded-2xl font-bold text-2xl hover:bg-[#059862] transition shadow-lg hover:shadow-2xl hover:-translate-y-1 transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                START THE QUIZ!
             </button>
             <Link to="/dashboard" className="inline-block mt-8 text-gray-400 font-bold hover:text-gray-600 transition tracking-tighter">BACK TO DASHBOARD</Link>
          </div>
        </main>
      </div>
    );
  }

  if (finished) {
    const getGrade = (pct) => {
      if (pct >= 90) return { label: '🏆 Excellent!', color: 'text-green-600' };
      if (pct >= 70) return { label: '✅ Good Job!', color: 'text-green-500' };
      if (pct >= 50) return { label: '📚 Keep Learning!', color: 'text-yellow-500' };
      return { label: '💪 Try Again!', color: 'text-orange-500' };
    };
    const grade = getGrade(result?.percentage || 0);

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 py-12 overflow-y-auto">
          <div className="max-w-3xl w-full mx-auto text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-50 my-10">
             <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 text-white shadow-xl ${result?.percentage >= 70 ? 'bg-green-500 shadow-green-200' : result?.percentage >= 50 ? 'bg-yellow-500 shadow-yellow-200' : 'bg-orange-500 shadow-orange-200'}`}>
                <Award size={64} className="animate-bounce" />
             </div>
             <h2 className="text-gray-500 uppercase tracking-[0.2em] font-extrabold text-sm mb-2">Quiz Completed!</h2>
             <p className={`text-2xl font-bold mb-4 ${grade.color}`}>{grade.label}</p>
             <h1 className="text-5xl font-black text-gray-900 mb-10">Your Score: <span className={result?.percentage >= 70 ? 'text-green-500' : result?.percentage >= 50 ? 'text-yellow-500' : 'text-orange-500'}>{result?.percentage}%</span></h1>
             
             <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-12 flex justify-between items-center px-10">
                <div className="text-center">
                   <div className="text-3xl font-extrabold text-green-600">{result?.score}</div>
                   <div className="text-xs text-gray-400 font-bold uppercase mt-1">Correct</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                   <div className="text-3xl font-extrabold text-red-500">{result?.total_questions - result?.score}</div>
                   <div className="text-xs text-gray-400 font-bold uppercase mt-1">Wrong</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                   <div className="text-3xl font-extrabold text-gray-900">{result?.total_questions}</div>
                   <div className="text-xs text-gray-400 font-bold uppercase mt-1">Total</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                   <div className="text-xl font-extrabold text-gray-900">{result?.percentage >= 70 ? 'PASS' : 'RETRY'}</div>
                   <div className="text-xs text-gray-400 font-bold uppercase mt-1">Status</div>
                </div>
             </div>

             {/* Detailed Results with Right/Wrong and Explanations */}
             {result?.details && (
               <div className="mb-12 space-y-6 text-left">
                 <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📋 Detailed Results</h3>
                 {result.details.map((detail, idx) => (
                   <div key={detail.question_id} className={`p-6 rounded-2xl border-2 transition-all ${detail.is_correct ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                     <div className="flex items-start gap-4">
                       <div className="mt-1 shrink-0">
                         {detail.is_correct 
                           ? <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center"><CheckCircle size={22} /></div>
                           : <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center"><XCircle size={22} /></div>
                         }
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold text-gray-900 text-lg mb-3">Q{idx + 1}. {detail.question}</h4>
                         
                         {/* Show all options with correct/wrong highlighting */}
                         <div className="space-y-2 mb-4">
                           {['a', 'b', 'c', 'd'].map((opt) => {
                             const optText = detail[`option_${opt}`];
                             const isUserAnswer = detail.user_answer === opt;
                             const isCorrectAnswer = detail.correct_answer === opt;
                             let optClass = 'bg-white border-gray-200 text-gray-600';
                             let badge = null;
                             
                             if (isCorrectAnswer && isUserAnswer) {
                               optClass = 'bg-green-100 border-green-400 text-green-800';
                               badge = <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">✓ Your Answer (Correct)</span>;
                             } else if (isCorrectAnswer) {
                               optClass = 'bg-green-100 border-green-400 text-green-800';
                               badge = <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">✓ Correct Answer</span>;
                             } else if (isUserAnswer) {
                               optClass = 'bg-red-100 border-red-400 text-red-800';
                               badge = <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">✗ Your Answer</span>;
                             }
                             
                             return (
                               <div key={opt} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${optClass} text-sm font-medium`}>
                                 <div className="flex items-center gap-3">
                                   <span className="font-bold uppercase w-6">{opt}.</span>
                                   <span>{optText}</span>
                                 </div>
                                 {badge}
                               </div>
                             );
                           })}
                           {!detail.user_answer && (
                             <p className="text-sm text-orange-600 font-semibold italic mt-1">⚠️ You skipped this question</p>
                           )}
                         </div>
                         
                         {/* Explanation */}
                         {detail.explanation && (
                           <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 font-medium">
                             <span className="font-bold text-blue-900 block mb-1">💡 Explanation:</span> {detail.explanation}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}

             <div className="flex flex-col gap-4">
                <Link to="/dashboard" className="py-4 bg-[#212121] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition">
                   BACK TO DASHBOARD
                </Link>
                <button 
                  onClick={() => {
                    setFinished(false);
                    setQuizStarted(false);
                    setCurrentIndex(0);
                    setAnswers([]);
                    setResult(null);
                  }}
                  className="py-4 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  RETRY QUIZ
                </button>
             </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = answers.filter(a => a !== undefined).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-200 h-2 sticky top-14 z-40 overflow-hidden">
        <div 
          className="bg-[#04AA6D] h-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
         <div className="flex items-center justify-between mb-10 mt-4 px-2">
            <h2 className="text-gray-400 font-extrabold uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="text-yellow-400" size={16} /> 
              {courseName && <span className="text-[#04AA6D]">{courseName}</span>}
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400">{answeredCount}/{questions.length} answered</span>
              <button 
                onClick={handleSubmit}
                className="text-[#04AA6D] font-bold hover:underline uppercase text-sm tracking-tighter"
              >
                Finish & Submit
              </button>
            </div>
         </div>

         {error && (
           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center gap-3 text-red-700 rounded-r-xl">
             <AlertCircle size={20} />
             <span className="text-sm font-semibold">{error}</span>
           </div>
         )}

         <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10 flex-1 flex flex-col">
            <div className="p-10 lg:p-14 bg-gray-50 border-b border-gray-100">
               <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">
                 {currentQuestion?.question}
               </h3>
            </div>

            <div className="p-10 lg:p-14 space-y-6 flex-1">
               {['a', 'b', 'c', 'd'].map((option) => {
                 const optionKey = `option_${option}`;
                 const isSelected = answers[currentIndex]?.answer === option;
                 return (
                   <button
                     key={option}
                     onClick={() => handleAnswerSelect(option)}
                     className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${
                       isSelected 
                         ? 'border-[#04AA6D] bg-[#E7F3EF] shadow-md ring-2 ring-[#04AA6D]/10' 
                         : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 shadow-sm'
                     }`}
                   >
                     <div className="flex items-center gap-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg transition-colors ${
                          isSelected ? 'bg-[#04AA6D] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                        }`}>
                          {option.toUpperCase()}
                        </div>
                        <span className={`text-lg font-bold ${isSelected ? 'text-[#04AA6D]' : 'text-gray-700'}`}>
                          {currentQuestion?.[optionKey]}
                        </span>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                       isSelected ? 'border-[#04AA6D] bg-[#04AA6D]' : 'border-gray-200 group-hover:border-gray-300'
                     }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                     </div>
                   </button>
                 );
               })}
            </div>
         </div>

         {/* Question Navigation Dots */}
         <div className="flex items-center justify-center gap-2 mb-6 flex-wrap px-4">
           {questions.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentIndex(idx)}
               className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                 idx === currentIndex 
                   ? 'bg-[#04AA6D] text-white scale-110 shadow-md' 
                   : answers[idx] 
                     ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                     : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
               }`}
             >
               {idx + 1}
             </button>
           ))}
         </div>

         <div className="flex items-center justify-between mb-10 px-4">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              PREVIOUS
            </button>
            <div className="flex gap-4">
              {currentIndex < questions.length - 1 ? (
                 <button 
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#04AA6D] text-white font-bold rounded-xl hover:bg-[#059862] transition shadow-lg flex items-center gap-2"
                 >
                    NEXT <ArrowRight size={18} />
                 </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="px-10 py-3 bg-black text-white font-extrabold rounded-xl hover:bg-gray-800 transition shadow-xl"
                >
                  SUBMIT QUIZ
                </button>
              )}
            </div>
         </div>
      </main>
    </div>
  );
};

export default QuizPage;
