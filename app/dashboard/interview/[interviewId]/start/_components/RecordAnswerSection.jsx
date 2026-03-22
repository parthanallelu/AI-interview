"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, CameraOff, Mic, Square, Sparkles, RefreshCcw, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Webcam from 'react-webcam'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useAuth } from '@/lib/AuthContext'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner' // Assuming sonner is used or I'll just use alerts for now

function RecordAnswerSection({
    mockInterviewQuestions,
    currentQuestionIndex = 0,
    onRecordedAnswer,
    recordedAnswers = {},
    interviewId
}) {
    const [isRecording, setIsRecording] = useState(false)
    const [webcamEnabled, setWebcamEnabled] = useState(false)
    const [error, setError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const mediaRecorderRef = useRef(null)
    const webcamRef = useRef(null)
    const { user } = useAuth()

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition()

    // Auto-enable camera if it was allowed before
    useEffect(() => {
        const savedState = sessionStorage.getItem('interviewCameraState');
        if (savedState) {
            setWebcamEnabled(true);
        }
    }, []);

    const startRecording = () => {
        if (!webcamRef.current?.stream) return;
        
        setIsRecording(true);
        setSaveSuccess(false);
        resetTranscript();
        
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.startListening({ continuous: true });
        }
    }

    const stopRecording = () => {
        setIsRecording(false);
        SpeechRecognition.stopListening();
        
        if (onRecordedAnswer) {
            onRecordedAnswer(currentQuestionIndex, null, transcript);
        }
    }

    const SaveUserAns = async () => {
        if (!transcript && !recordedAnswers[currentQuestionIndex]) {
            setError("No answer detected. Please speak clearly.");
            return;
        }

        setIsSaving(true);
        setError(null);
        
        try {
            const currentQuestion = mockInterviewQuestions[currentQuestionIndex].question;
            const userAns = transcript || "User provided a video-only response.";
            
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion,
                    userAns: userAns
                }),
            });

            const feedbackJson = await response.json();

            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewId,
                question: currentQuestion,
                correctAns: mockInterviewQuestions[currentQuestionIndex].answer || '',
                userAns: userAns,
                feedback: feedbackJson.feedback,
                rating: String(feedbackJson.rating),
                difficulty: feedbackJson.difficulty || 'Intermediate',
                category: feedbackJson.category || 'Technical',
                userEmail: user?.email || 'unknown',
                createdAt: moment().format('DD-MM-YYYY')
            });

            if (resp) {
                setSaveSuccess(true);
            }

        } catch (err) {
            console.error('Error saving:', err);
            setError("Failed to persist analysis. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <motion.div 
                layout
                className="relative bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl border-4 border-gray-100 dark:border-gray-800 aspect-video"
            >
                {webcamEnabled ? (
                    <Webcam
                        ref={webcamRef}
                        audio={true}
                        mirrored={true}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-950">
                        <CameraOff size={48} className="text-gray-800" />
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                    <AnimatePresence>
                        {isRecording && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-3 bg-red-600/90 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-4"
                            >
                                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">A1 Recording Active</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Live Feedback Engine v4.0
                    </div>
                </div>

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div className={`w-3 h-3 rounded-full ${webcamEnabled ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-gray-700'}`} />
                    <div className={`w-3 h-3 rounded-full ${listening ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-gray-700'}`} />
                </div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-4">
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setWebcamEnabled(!webcamEnabled)}
                        className="rounded-2xl h-14 w-14 dark:bg-gray-900 dark:border-gray-800 hover:border-indigo-500 transition-all"
                    >
                        {webcamEnabled ? <CameraOff size={24} /> : <Camera size={24} />}
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => resetTranscript()}
                        className="rounded-2xl h-14 w-14 dark:bg-gray-900 dark:border-gray-800 hover:border-indigo-500 transition-all"
                        disabled={isRecording}
                    >
                        <RefreshCcw size={24} />
                    </Button>
                </div>

                <Button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`h-14 px-10 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.98] ${
                        isRecording 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                    }`}
                >
                    {isRecording ? (
                        <div className="flex items-center gap-3">
                            <Square size={24} fill="white" />
                            END RECORDING
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Mic size={24} />
                            START ANSWER
                        </div>
                    )}
                </Button>

                <Button 
                    variant="outline"
                    onClick={SaveUserAns}
                    disabled={isSaving || isRecording || (!transcript && !saveSuccess)}
                    className={`h-14 px-8 rounded-2xl font-black transition-all flex items-center gap-3 ${
                        saveSuccess 
                            ? 'bg-green-50 border-green-200 text-green-600' 
                            : 'dark:bg-indigo-900/10 dark:border-indigo-800/50 text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                    {isSaving ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent" />
                    ) : saveSuccess ? (
                        <CheckCircle2 size={24} />
                    ) : (
                        <Save size={24} />
                    )}
                    {isSaving ? "ANALYZING..." : saveSuccess ? "ANALYSIS SYNCED" : "RUN AI ANALYSIS"}
                </Button>
            </div>

            <AnimatePresence>
                {transcript && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-8 bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm relative group"
                    >
                        <div className="absolute top-6 right-8 text-[10px] font-black text-indigo-600 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                            Real-time Transcript
                        </div>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed font-serif italic">
                            "{transcript}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900 text-sm font-bold">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
        </div>
    )
}

export default RecordAnswerSection