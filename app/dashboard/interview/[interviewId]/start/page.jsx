'use client'
import React, { useEffect, useState, use } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Send, Sparkles } from 'lucide-react';

function StartInterview({ params }) {
  const { interviewId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recordedAnswers, setRecordedAnswers] = useState({});
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
      const parsedQuestions = JSON.parse(interview.jsonmockresp);
      setMockInterviewQuestions(parsedQuestions);
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
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleRecordedAnswer = (questionIndex, recordingUrl, transcriptText) => {
    setRecordedAnswers(prev => ({ ...prev, [questionIndex]: recordingUrl }));
    setAnswers(prev => ({ ...prev, [questionIndex]: transcriptText }));
  };

  const handleSubmitInterview = async () => {
    if (confirm('Are you sure you want to end the interview? You will be redirected to the feedback page.')) {
        router.push(`/dashboard/interview/${interviewId}/feedback`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Synchronizing AI Agents...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
        {/* Top Navigation & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
                    <ChevronLeft size={24} />
                </Button>
                <div>
                    <h1 className='text-3xl font-black tracking-tight text-gray-900 dark:text-white font-serif'>
                        Live Session
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Recoding Active • {interviewDetails?.jobPosition}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end mr-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Progress</p>
                    <p className="text-lg font-black text-indigo-600 leading-none">{currentQuestionIndex + 1} <span className="text-gray-300 dark:text-gray-700">/ {mockInterviewQuestions?.length}</span></p>
                </div>
                <Button 
                    onClick={handleSubmitInterview}
                    className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-2xl px-6 h-12 font-bold transition-all flex items-center gap-2 border border-red-100 dark:border-red-900"
                >
                    <Send size={18} />
                    End Interview
                </Button>
            </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / mockInterviewQuestions?.length) * 100}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
            {/* Left Section - Question Details */}
            <div className='lg:col-span-6 space-y-6'>
                <QuestionsSection 
                    mockInterviewQuestions={mockInterviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionChange={handleQuestionChange}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                />
                
                <div className='p-6 bg-amber-50 dark:bg-amber-950/20 rounded-[32px] border border-amber-100 dark:border-amber-900/50 flex items-start gap-4'>
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-700 dark:text-amber-400">
                        <Info size={20} />
                    </div>
                    <div>
                        <h4 className='font-bold text-amber-900 dark:text-amber-300 text-sm mb-1'>Important Note</h4>
                        <p className='text-xs font-medium text-amber-800 dark:text-amber-400 leading-relaxed'>
                            Click on 'Record Answer' when you're ready to speak. The AI will listen to your response and provide a detailed analysis based on technical correctness and communication.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - AI Recording Chamber */}
            <div className='lg:col-span-6'>
                <RecordAnswerSection 
                    mockInterviewQuestions={mockInterviewQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    onRecordedAnswer={handleRecordedAnswer}
                    recordedAnswers={recordedAnswers}
                    interviewId={interviewId}
                />
            </div>
        </div>
    </div>
  );
}

export default StartInterview;