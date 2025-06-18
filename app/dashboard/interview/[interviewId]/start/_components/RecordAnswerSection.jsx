'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Camera, CameraOff, Mic, Square } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Webcam from 'react-webcam'

function RecordAnswerSection({
    mockInterviewQuestions,
    currentQuestionIndex = 0,
    onRecordedAnswer,
    recordedAnswers = {}
}) {
    const [isRecording, setIsRecording] = useState(false)
    const [webcamEnabled, setWebcamEnabled] = useState(false)
    const [error, setError] = useState(null)
    const [autoStartAttempted, setAutoStartAttempted] = useState(false)

    const mediaRecorderRef = useRef(null)
    const webcamRef = useRef(null)
    const videoUrlsRef = useRef(new Set()) // Track URLs for cleanup

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition()

    // Check if camera was enabled on previous page
    useEffect(() => {
        const checkPreviousCameraState = () => {
            if (typeof window !== 'undefined' && !autoStartAttempted) {
                const savedCameraState = sessionStorage.getItem('interviewCameraState');
                if (savedCameraState) {
                    try {
                        const cameraState = JSON.parse(savedCameraState);
                        const timeDiff = Date.now() - cameraState.timestamp;
                        
                        // If camera was enabled recently (within 30 seconds), auto-start
                        if (cameraState.isCameraEnabled && timeDiff < 30000) {
                            setAutoStartAttempted(true);
                            startCamera();
                            // Clear the state after using it
                            sessionStorage.removeItem('interviewCameraState');
                        }
                    } catch (error) {
                        console.error('Error parsing camera state:', error);
                    }
                }
                setAutoStartAttempted(true);
            }
        };

        // Small delay to ensure component is mounted
        const timer = setTimeout(checkPreviousCameraState, 500);
        return () => clearTimeout(timer);
    }, [autoStartAttempted]);

    // Check browser support
    const checkBrowserSupport = () => {
        const hasMediaRecorder = typeof MediaRecorder !== 'undefined'
        const hasGetUserMedia = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        
        if (!hasMediaRecorder) {
            setError('MediaRecorder is not supported in this browser')
            return false
        }
        
        if (!hasGetUserMedia) {
            setError('Camera access is not supported in this browser')
            return false
        }
        
        if (!browserSupportsSpeechRecognition) {
            console.warn('Speech recognition is not supported in this browser')
        }
        
        return true
    }

    const startCamera = async () => {
        if (!checkBrowserSupport()) return
        
        try {
            setError(null)
            setWebcamEnabled(true)
        } catch (err) {
            console.error('Camera start error:', err)
            setError('Failed to start camera: ' + err.message)
            setWebcamEnabled(false)
        }
    }

    const stopCamera = () => {
        setWebcamEnabled(false)
        if (isRecording) {
            stopRecording()
        }
    }

    const startRecording = () => {
        if (!webcamRef.current?.stream) {
            setError("Camera not ready. Please start the camera first.")
            return
        }

        try {
            const stream = webcamRef.current.stream
            
            // Check if MediaRecorder supports the stream
            if (!MediaRecorder.isTypeSupported('video/webm')) {
                console.warn('webm not supported, trying mp4')
                if (!MediaRecorder.isTypeSupported('video/mp4')) {
                    setError('Video recording not supported in this browser')
                    return
                }
            }

            const mediaRecorder = new MediaRecorder(stream, { 
                mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
            })

            mediaRecorderRef.current = mediaRecorder
            const chunks = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { 
                    type: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
                })
                const videoUrl = URL.createObjectURL(blob)
                
                // Track URL for cleanup
                videoUrlsRef.current.add(videoUrl)

                if (onRecordedAnswer) {
                    onRecordedAnswer(currentQuestionIndex, videoUrl, transcript || '')
                }

                resetTranscript()
            }

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error)
                setError('Recording failed: ' + event.error.message)
                setIsRecording(false)
            }

            mediaRecorder.start()
            
            // Start speech recognition if supported
            if (browserSupportsSpeechRecognition) {
                try {
                    SpeechRecognition.startListening({ continuous: true })
                } catch (err) {
                    console.warn('Speech recognition failed to start:', err)
                }
            }
            
            setIsRecording(true)
            setError(null)
            
        } catch (err) {
            console.error('Recording start error:', err)
            setError('Failed to start recording: ' + err.message)
        }
    }

    const stopRecording = () => {
        try {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop()
            }
            
            if (browserSupportsSpeechRecognition && listening) {
                SpeechRecognition.stopListening()
            }
            
            setIsRecording(false)
            setError(null)
        } catch (err) {
            console.error('Recording stop error:', err)
            setError('Failed to stop recording: ' + err.message)
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Stop any ongoing recording
            if (isRecording) {
                stopRecording()
            }
            
            // Clean up webcam streams
            if (webcamRef.current?.stream) {
                webcamRef.current.stream.getTracks().forEach(track => track.stop())
            }
            
            // Revoke all created URLs to prevent memory leaks
            videoUrlsRef.current.forEach(url => {
                URL.revokeObjectURL(url)
            })
            videoUrlsRef.current.clear()
        }
    }, [])

    // Handle webcam errors
    const handleWebcamError = (err) => {
        console.error("Webcam error:", err)
        setError("Camera access failed: " + err.message)
        setWebcamEnabled(false)
    }

    // Handle successful webcam initialization
    const handleWebcamUserMedia = (stream) => {
        setWebcamEnabled(true)
        setError(null)
    }

    const SaveUserAns = async ()=>{
        if(isRecording){
            const feedbackprompt = "Question: "+mockInterviewQuestions[currentQuestionIndex].question+"\n\n"+"Answer: "+recordedAnswers[currentQuestionIndex]+"\n\n"+"Rate the answer for the given question and provide feedbackfor improvement if any in 5,6 lines om json formar";
            const response = await fetch("/api/feedback",{
                method: "POST",
                body: JSON.stringify({prompt: feedbackprompt}),
            });
            const data = await response.json();
            console.log(data);
        }
    }
    

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Auto-start notification */}
            {autoStartAttempted && webcamEnabled && !error && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                        ✓ Camera automatically enabled from previous setup
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Browser Support Warning */}
            {!browserSupportsSpeechRecognition && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        Speech recognition is not supported in this browser. You can still record video.
                    </p>
                </div>
            )}

            {/* Webcam Display */}
            <div className="relative mb-6">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    {webcamEnabled ? (
                        <Webcam
                            ref={webcamRef}
                            audio={true}
                            className="w-full h-full object-cover rounded-lg"
                            videoConstraints={{
                                width: 1280,
                                height: 720,
                                facingMode: "user"
                            }}
                            onUserMedia={handleWebcamUserMedia}
                            onUserMediaError={handleWebcamError}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <Camera size={48} className="mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-500 font-medium">Camera not active</p>
                                    <p className="text-sm text-gray-400">
                                        {autoStartAttempted ? 'Click "Start Camera" to begin' : 'Checking previous camera setup...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recording Indicator */}
                {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Recording</span>
                    </div>
                )}
            </div>

            {/* Camera Controls */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={webcamEnabled ? stopCamera : startCamera}
                    disabled={isRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        webcamEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                >
                    {webcamEnabled ? <CameraOff size={20} /> : <Camera size={20} />}
                    {webcamEnabled ? 'Stop Camera' : 'Start Camera'}
                </button>
            </div>

            {/* Recording Controls */}
            <div className="text-center mb-6">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!webcamEnabled && !isRecording}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all mx-auto ${
                        isRecording
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
                        }`}
                >
                    {isRecording ? (
                        <>
                            <Square size={20} />
                            Stop Recording
                        </>
                    ) : (
                        <>
                            <Mic size={20} />
                            Record Answer
                        </>
                    )}
                </button>

                {!webcamEnabled && !isRecording && (
                    <p className="text-sm text-gray-500 mt-2">
                        Enable camera to start recording your answer
                    </p>
                )}
            </div>

            {/* Recording Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">Recording Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure good lighting and stable internet</li>
                    <li>• Speak clearly and maintain eye contact</li>
                    <li>• Keep your answers concise and structured</li>
                    <li>• You can re-record if needed</li>
                </ul>
            </div>

            {/* Speech Recognition Display */}
            {listening && transcript && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">🎤 Live Transcript:</p>
                    <p className="text-sm text-blue-900">{transcript}</p>
                </div>
            )}

            {/* Recorded Answer Preview */}
            {recordedAnswers[currentQuestionIndex] && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-green-800">
                            ✓ Answer Recorded Successfully
                        </p>
                        <span className="text-xs text-green-600">Answer Preview</span>
                    </div>
                    <p className="text-sm text-green-900 whitespace-pre-line">
                        {recordedAnswers[currentQuestionIndex]}
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                        You can record again to replace this answer
                    </p>
                </div>
            )}

            {/* Status Information */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Camera Status:</span>
                    <span className={`font-medium ${webcamEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                        {webcamEnabled ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Recording Status:</span>
                    <span className={`font-medium ${isRecording ? 'text-red-600' : 'text-gray-500'}`}>
                        {isRecording ? 'Recording...' : 'Ready'}
                    </span>
                </div>
                {browserSupportsSpeechRecognition && (
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Speech Recognition:</span>
                        <span className={`font-medium ${listening ? 'text-blue-600' : 'text-gray-500'}`}>
                            {listening ? 'Listening...' : 'Ready'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )//hrllopwojepifjidrofj
}

export default RecordAnswerSection