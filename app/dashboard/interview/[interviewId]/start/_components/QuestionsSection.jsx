"use client"
import React, { useState, useEffect } from 'react'
import { Volume2, ChevronLeft, ChevronRight, Sparkles, Brain, Clock, HelpCircle } from 'lucide-react'
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
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const percentage = ((currentQuestionIndex + 1) / mockInterviewQuestions.length) * 100;
        setProgress(percentage);
    }, [currentQuestionIndex, mockInterviewQuestions]);

    if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) return null;

    const currentQuestion = mockInterviewQuestions[currentQuestionIndex];

    const speakQuestion = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
            utterance.rate = 1;
            utterance.pitch = 1.1;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className='flex flex-col h-full bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden'>
            {/* Progress Header */}
            <div className="bg-indigo-600/5 dark:bg-indigo-900/10 p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
                            {currentQuestionIndex + 1}
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Assessment</h3>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">Current Prompt</h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-black text-indigo-600">{Math.round(progress)}% Complete</span>
                    </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <h2 className='text-3xl font-black text-gray-900 dark:text-white leading-tight font-serif tracking-tight'>
                                {currentQuestion.question}
                            </h2>
                            <Button 
                                variant="outline" 
                                onClick={speakQuestion}
                                className={`h-14 px-6 rounded-2xl flex items-center gap-3 font-bold transition-all ${isSpeaking ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse shadow-lg shadow-indigo-600/20' : 'hover:border-indigo-500 hover:text-indigo-600'}`}
                            >
                                <Volume2 size={24} />
                                {isSpeaking ? "Narrating Question..." : "Narrate Question"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-6 bg-gray-50 dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                    <Brain size={20} />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Focus Area</h5>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{currentQuestion.category || "Theoretical Fundamentals"}</p>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-gray-50 dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-start gap-4">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Recommended Duration</h5>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">90 - 120 Seconds</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="p-8 bg-gray-50/50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-500">
                    <HelpCircle size={18} />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        Don't rush. Take 5 seconds to structure your thoughts before recording.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default QuestionsSection