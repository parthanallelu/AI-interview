"use client"
import React, { useState, useEffect } from 'react'
import { Volume2, ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

function QuestionsSection({ 
    mockInterviewQuestions = [], 
    currentQuestionIndex = 0, 
    onQuestionChange,
    answers = {},
    onAnswerChange 
}) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
        return null;
    }

    const currentQuestion = mockInterviewQuestions[currentQuestionIndex];

    const speakQuestion = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
            utterance.rate = 0.9;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white dark:bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col'
        >
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Question {currentQuestionIndex + 1}</span>
                </div>
                <div className="flex gap-1">
                    {mockInterviewQuestions.map((_, index) => (
                        <div 
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentQuestionIndex 
                                    ? 'w-6 bg-indigo-600' 
                                    : answers[index] 
                                        ? 'w-2 bg-green-500' 
                                        : 'w-2 bg-gray-200 dark:bg-gray-800'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                >
                    <div className="flex items-start justify-between gap-6 mb-8">
                        <h2 className='text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight font-serif'>
                            {currentQuestion.question}
                        </h2>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={speakQuestion}
                            className={`rounded-2xl shrink-0 h-14 w-14 shadow-sm transition-all ${isSpeaking ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse' : 'hover:border-indigo-500 hover:text-indigo-600 dark:bg-gray-800'}`}
                        >
                            <Volume2 size={24} />
                        </Button>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8">
                        <div className="flex items-center gap-2 mb-3 text-gray-400">
                            <HelpCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Target Context</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 italic">
                            {currentQuestion.category || "General Technical Inquiry"} • Focus on {currentQuestion.difficulty || "standard"} expectations.
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-auto pt-8">
                <Button 
                    variant="ghost" 
                    onClick={() => onQuestionChange(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="h-12 px-6 rounded-xl font-bold gap-2 text-gray-500 hover:text-indigo-600 disabled:opacity-30"
                >
                    <ChevronLeft size={20} />
                    Previous
                </Button>
                
                <div className="flex items-center gap-2">
                    {currentQuestionIndex < mockInterviewQuestions.length - 1 ? (
                        <Button 
                            onClick={() => onQuestionChange(currentQuestionIndex + 1)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-600/20 group transition-all"
                        >
                            Next Question
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-black text-sm uppercase tracking-widest px-4 py-2 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900">
                            <Sparkles size={16} />
                            Final Question
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default QuestionsSection