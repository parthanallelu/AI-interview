'use client'
import React, { useEffect, useState, use } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Sparkles, Timer, LayoutDashboard, ChevronRight } from 'lucide-react';

function StartInterview({ params }) {
  const { interviewId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recordedAnswers, setRecordedAnswers] = useState({});
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockid, interviewId));
      if (!result || result.length === 0) throw new Error('Interview not found');
      const interview = result[0];
      setInterviewDetails(interview);
      try {
          const parsedQuestions = JSON.parse(interview.jsonmockresponse);
          setMockInterviewQuestions(parsedQuestions);
      } catch (parseErr) {
          console.error('Failed to parse questions:', parseErr);
          setError('Failed to parse interview questions data.');
      }
    } catch (err) {
      console.error('Error fetching interview details:', err);
      setError(err.message || 'Failed to load interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < mockInterviewQuestions.length) {
      setCurrentQuestionIndex(newIndex);
      setIsQuestionAnswered(!!answers[newIndex]);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    if (questionIndex === currentQuestionIndex) setIsQuestionAnswered(true);
  };

  const handleRecordedAnswer = (questionIndex, recordingUrl, transcriptText) => {
    setRecordedAnswers(prev => ({ ...prev, [questionIndex]: recordingUrl }));
    setAnswers(prev => ({ ...prev, [questionIndex]: transcriptText }));
    if (questionIndex === currentQuestionIndex) setIsQuestionAnswered(true);
  };

  const handleSubmitInterview = async () => {
    if (confirm('Are you sure you want to end the interview? You will be redirected to the feedback page.')) {
        router.push(`/dashboard/interview/${interviewId}/feedback`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-[0.2em] text-xs">Calibrating AI Neural Links...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[calc(100vh-140px)] min-h-[600px]'>
        {/* Top bar with high-end aesthetic */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-gray-950 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" onClick={() => router.replace('/dashboard')} className="rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 h-12 w-12">
                    <LayoutDashboard size={20} />
                </Button>
                <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800" />
                <div>
                   <h1 className='text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-2'>
                        Live Assessment <span className="text-indigo-600">Room</span>
                   </h1>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{interviewDetails?.jobPosition} • Technical Round</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Stream Active</span>
                    </div>
                    <div className="flex gap-1">
                        {mockInterviewQuestions.map((_, index) => (
                            <div key={index} className={`h-1 rounded-full transition-all duration-500 ${index <= currentQuestionIndex ? 'w-4 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-gray-800'}`} />
                        ))}
                    </div>
                </div>
                
                <Button 
                    onClick={handleSubmitInterview}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                >
                    Finish Session
                </Button>
            </div>
        </div>

        {/* Rigid Split-Screen Layout */}
        <div className='flex flex-1 gap-8 overflow-hidden'>
            {/* Left Panel - Question Flow (40%) */}
            <div className='w-[40%] flex flex-col'>
                <QuestionsSection 
                    mockInterviewQuestions={mockInterviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={handleQuestionChange}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                />
            </div>

            {/* Right Panel - Recording Hall (60%) */}
            <div className='w-[60%] flex flex-col relative'>
                <RecordAnswerSection 
                    mockInterviewQuestions={mockInterviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    onRecordedAnswer={handleRecordedAnswer}
                    recordedAnswers={recordedAnswers}
                    interviewId={interviewId}
                />

                {/* Floating "Next" action when answered */}
                <AnimatePresence>
                    {isQuestionAnswered && currentQuestionIndex < mockInterviewQuestions.length - 1 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-10 right-10 z-50"
                        >
                            <Button 
                                onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl px-10 h-16 font-black text-md shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-3"
                            >
                                CONTINUE TO NEXT
                                <ChevronRight size={24} />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}

export default StartInterview;