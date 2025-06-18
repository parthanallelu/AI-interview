import React, { useState, useEffect } from 'react'
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react'

function QuestionsSection({ 
    mockInterviewQuestions = [], 
    currentQuestionIndex = 0, 
    onQuestionChange,
    answers = {},
    onAnswerChange 
}) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    if (!mockInterviewQuestions || mockInterviewQuestions.length === 0) {
        return (
            <div className='p-6 bg-white rounded-xl shadow-lg'>
                
                <div className='text-gray-500 text-center py-8'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    Loading questions...
                </div>
            </div>
        )
    }

    const currentQuestion = mockInterviewQuestions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex] || '';

    // Text-to-speech functionality
    const speakQuestion = () => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            
            utterance.onend = () => {
                setIsSpeaking(false);
            };
            
            utterance.onerror = () => {
                setIsSpeaking(false);
            };
            
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not supported in your browser');
        }
    };

    // Navigation functions
    const goToQuestion = (index) => {
        if (onQuestionChange) {
            onQuestionChange(index);
        }
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0 && onQuestionChange) {
            onQuestionChange(currentQuestionIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentQuestionIndex < mockInterviewQuestions.length - 1 && onQuestionChange) {
            onQuestionChange(currentQuestionIndex + 1);
        }
    };

    // Handle answer input
    const handleAnswerChange = (value) => {
        if (onAnswerChange) {
            onAnswerChange(currentQuestionIndex, value);
        }
    };

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className='p-6 bg-white rounded-xl shadow-lg'>
            <div className="flex items-center justify-between mb-6">
                
                <div className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {mockInterviewQuestions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                        {Object.keys(answers).length}/{mockInterviewQuestions.length} Answered
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(Object.keys(answers).length / mockInterviewQuestions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {mockInterviewQuestions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            index === currentQuestionIndex
                                ? 'bg-blue-600 text-white'
                                : answers[index]
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Q{index + 1}
                    </button>
                ))}
            </div>

            {/* Current Question */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <h2 className='text-lg font-semibold text-gray-900 flex-1'>
                        {currentQuestionIndex + 1}. {currentQuestion.question}
                    </h2>
                    <button
                        onClick={speakQuestion}
                        disabled={isSpeaking}
                        className={`p-2 rounded-lg transition-all ${
                            isSpeaking 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title="Read question aloud"
                    >
                        <Volume2 size={20} />
                    </button>
                </div>
            </div>

            {/* Answer Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                </label>
                <textarea
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Type your answer here or use voice recording..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={goToPrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={20} />
                    Previous
                </button>
                <button
                    onClick={goToNext}
                    disabled={currentQuestionIndex === mockInterviewQuestions.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Next
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    )
}

export default QuestionsSection