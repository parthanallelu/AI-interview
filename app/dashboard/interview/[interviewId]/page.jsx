'use client'
import React, { useEffect, useState, use } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import {
  Lightbulb,
  WebcamIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Brain,
  Camera,
  Mic,
  MicOff,
  CameraOff,
  Play,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Interview({ params }) {
  const { interviewId } = use(params);
  const router = useRouter();
  const [interviewDetails, setInterviewDetails] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [webcamStream, setWebcamStream] = useState(null);
  const [checklist, setChecklist] = useState({
    camera: false,
    microphone: false,
    environment: false,
    mindset: false
  });

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockid, interviewId));
      setInterviewDetails(result[0]);
    } catch (error) {
      console.error('Error fetching interview details:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCameraToggle = () => {
    setIsCameraOpen(!isCameraOpen);
    setChecklist(prev => ({ ...prev, camera: !isCameraOpen }));
  };

  const handleChecklistToggle = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Handle webcam user media success
  const handleWebcamUserMedia = (stream) => {
    setIsCameraOpen(true);
    setIsMicEnabled(true);
    setWebcamStream(stream);
    setChecklist(prev => ({ ...prev, camera: true }));
  };

  // Handle webcam user media error
  const handleWebcamUserMediaError = (error) => {
    console.error('Webcam error:', error);
    setIsCameraOpen(false);
    setIsMicEnabled(false);
    setWebcamStream(null);
    setChecklist(prev => ({ ...prev, camera: false }));
  };

  // Function to start interview with camera state
  const startInterviewWithCamera = () => {
    if (isCameraOpen && webcamStream) {
      // Store camera state in sessionStorage to persist across page navigation
      const cameraState = {
        isCameraEnabled: true,
        timestamp: Date.now()
      };
      
      // Store in sessionStorage (temporary for this session)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('interviewCameraState', JSON.stringify(cameraState));
      }
    }
    
    // Navigate to start page
    router.push(`/dashboard/interview/${interviewId}/start`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Interview Practice
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN - Job Details */}
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-6'>
                <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  Interview Details
                </h2>
              </div>
              <div className='p-6 space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Position</label>
                  <p className='text-lg font-semibold text-gray-900 mt-1'>
                    {interviewDetails?.jobPosition || 'Loading...'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Requirements</label>
                  <p className='text-gray-900 text-lg font-semibold mt-1 leading-relaxed'>
                    {interviewDetails?.jobDescription || 'Loading...'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 uppercase tracking-wide'>Experience Level</label>
                  <p className='text-lg font-semibold text-gray-900 mt-1'>
                    {interviewDetails?.jobExperience || 'Loading...'} years
                  </p>
                </div>
              </div>
            </div>

            {/* Interview Tips */}
            <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6'>
              <h3 className='flex items-center gap-2 text-amber-800 font-semibold text-lg mb-3'>
                <Lightbulb className='h-5 w-5' />
                Quick Tips
              </h3>
              <ul className='space-y-2 text-amber-700'>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='h-4 w-4 mt-1 text-amber-600' />
                  <span className='text-sm'>Speak clearly and maintain eye contact with the camera</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='h-4 w-4 mt-1 text-amber-600' />
                  <span className='text-sm'>Take your time to think before answering</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='h-4 w-4 mt-1 text-amber-600' />
                  <span className='text-sm'>Use the STAR method for behavioral questions</span>
                </li>
                <li className='flex items-start gap-2'>
                  <CheckCircle className='h-4 w-4 mt-1 text-amber-600' />
                  <span className='text-sm'>Stay calm and confident throughout</span>
                </li>
              </ul>
            </div>
          </div>

          {/* MIDDLE COLUMN - Camera Setup */}
          <div>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-purple-600 to-pink-600 p-6'>
                <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                  <Camera className='h-5 w-5' />
                  Camera & Audio Setup
                </h2>
              </div>
              <div className='p-6'>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 relative">
                  {isCameraOpen ? (
                    <Webcam
                      onUserMedia={handleWebcamUserMedia}
                      onUserMediaError={handleWebcamUserMediaError}
                      className='w-full h-full object-cover'
                      mirrored={true}
                      audio={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <WebcamIcon className='h-20 w-20 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-500 font-medium'>Camera Preview</p>
                        <p className='text-sm text-gray-400'>Enable camera to see yourself</p>
                      </div>
                    </div>
                  )}

                  {/* Camera Status Indicators */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className={`p-2 rounded-full ${isCameraOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCameraOpen ? <Camera className='h-4 w-4 text-white' /> : <CameraOff className='h-4 w-4 text-white' />}
                    </div>
                    <div className={`p-2 rounded-full ${isMicEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isMicEnabled ? <Mic className='h-4 w-4 text-white' /> : <MicOff className='h-4 w-4 text-white' />}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCameraToggle}
                    className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isCameraOpen
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600'
                      }`}
                  >
                    {isCameraOpen ? (
                      <>
                        <CameraOff className='h-5 w-5' />
                        Turn Off Camera
                      </>
                    ) : (
                      <>
                        <Camera className='h-5 w-5' />
                        Enable Camera & Microphone
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Make sure you're in a well-lit, quiet environment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Readiness Checklist */}
          <div className='space-y-6'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-green-600 to-emerald-600 p-6'>
                <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  Readiness Checklist
                </h2>
              </div>
              <div className='p-6 space-y-4'>
                {/* Checklist Items */}
                {[
                  {
                    key: 'camera',
                    label: 'Camera & Microphone Working',
                    icon: Camera,
                    auto: true,
                    checked: checklist.camera && isCameraOpen
                  },
                  {
                    key: 'environment',
                    label: 'Quiet Environment Setup',
                    icon: Settings,
                    description: 'No distractions, good lighting'
                  },
                  {
                    key: 'mindset',
                    label: 'Ready & Confident',
                    icon: Brain,
                    description: 'Feeling prepared and positive'
                  }
                ].map(item => (
                  <div
                    key={item.key}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${(item.auto ? (checklist[item.key] && isCameraOpen) : checklist[item.key])
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => !item.auto && handleChecklistToggle(item.key)}
                        className={`p-2 rounded-full transition-colors ${(item.auto ? (checklist[item.key] && isCameraOpen) : checklist[item.key])
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                          } ${item.auto ? 'cursor-default' : 'cursor-pointer'}`}
                        disabled={item.auto}
                      >
                        {(item.auto ? (checklist[item.key] && isCameraOpen) : checklist[item.key]) ?
                          <CheckCircle className='h-4 w-4' /> :
                          <item.icon className='h-4 w-4' />
                        }
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.label}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Stats */}
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-6'>
              <h3 className='font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <Clock className='h-5 w-5 text-blue-600' />
                What to Expect
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-600'>Duration</span>
                  <span className='font-medium text-gray-900'>15-30 minutes</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                  <span className='text-gray-600'>Number of Questions</span>
                  <span className='font-medium text-gray-900'>5-8 questions</span>
                </div>
                <div className='flex justify-between items-center py-2'>
                  <span className='text-gray-600'>Format</span>
                  <span className='font-medium text-gray-900'>Interactive Q&A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Section */}
        <div className='mt-12 text-center'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-2xl mx-auto'>
            <div>
              <div className='bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                <Play className='h-8 w-8 text-blue-600' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>Ready to Begin?</h3>
              <p className='text-gray-600 mb-6'>Click the button below to start your mock interview session.</p>

              <button 
                onClick={startInterviewWithCamera}
                className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              >
                <Play className='h-6 w-6' />
                Start Interview Now
              </button>
            </div>

            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-sm text-gray-500'>
                Need help? Check our <span className='text-blue-600 cursor-pointer'>setup guide</span> or <span className='text-blue-600 cursor-pointer'>contact support</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Interview;