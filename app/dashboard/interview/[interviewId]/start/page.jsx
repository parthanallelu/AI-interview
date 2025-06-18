'use client'
import React, { useEffect, useState, use } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview({ params }) {
  const { interviewId } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  
  // New states for enhanced functionality
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recordedAnswers, setRecordedAnswers] = useState({});

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockid, interviewId));
      
      if (!result || result.length === 0) {
        throw new Error('Interview not found');
      }

      const interview = result[0];
      setInterviewDetails(interview);

      try {
        const parsedQuestions = JSON.parse(interview.jsonmockresponse);
        setMockInterviewQuestions(parsedQuestions);
      } catch (parseError) {
        console.error('Error parsing interview questions:', parseError);
        setError('Failed to parse interview questions');
      }

    } catch (err) {
      console.error('Error fetching interview details:', err);
      setError(err.message || 'Failed to load interview');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle question navigation
  const handleQuestionChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < mockInterviewQuestions.length) {
      setCurrentQuestionIndex(newIndex);
    }
  };

  // Handle answer changes
  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  // Handle recorded answers
  const handleRecordedAnswer = (questionIndex, recordingUrl, transcriptText) => {
    setRecordedAnswers(prev => ({
      ...prev,
      [questionIndex]: recordingUrl
    }));
  
    const combinedText = transcriptText 
      ? `${transcriptText}\n\n[Video answer recorded at ${new Date().toLocaleTimeString()}]` 
      : `[Video answer recorded at ${new Date().toLocaleTimeString()}]`;
  
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: combinedText
    }));
  };
  

  // Submit interview
  const handleSubmitInterview = async () => {
    const answeredQuestions = Object.keys(answers).length;
    const recordedQuestions = Object.keys(recordedAnswers).length;
    const totalQuestions = mockInterviewQuestions.length;
    
    if (answeredQuestions === 0 && recordedQuestions === 0) {
      alert('Please answer at least one question before submitting.');
      return;
    }
    
    const confirmSubmit = window.confirm(
      `You have provided ${answeredQuestions} text answers and ${recordedQuestions} video answers out of ${totalQuestions} total questions.\n\nAre you sure you want to submit your interview?`
    );
    
    if (confirmSubmit) {
      try {
        // Here you can save the answers to your database
        // Example: Save to UserAnswer table or update MockInterview
        console.log('Submitting interview:', {
          interviewId,
          answers,
          recordedAnswers,
          interviewDetails
        });

        // You can add database save logic here
        // await db.insert(UserAnswer).values({
        //   mockInterviewId: interviewId,
        //   textAnswers: JSON.stringify(answers),
        //   recordedAnswers: JSON.stringify(recordedAnswers),
        //   submittedAt: new Date()
        // });

        alert('Interview submitted successfully! Thank you for your participation.');
        
        // Optional: Redirect to results page or dashboard
        // router.push('/dashboard');
        
      } catch (error) {
        console.error('Error submitting interview:', error);
        alert('There was an error submitting your interview. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-full mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Interview Practice
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>


          {/* Questions Section */}
          <QuestionsSection 
            mockInterviewQuestions={mockInterviewQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionChange={handleQuestionChange}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />
          
          {/* Recording Section */}
          <RecordAnswerSection 
            mockInterviewQuestions={mockInterviewQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onRecordedAnswer={handleRecordedAnswer}
            recordedAnswers={recordedAnswers}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmitInterview}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Submit Interview
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Make sure to answer all questions before submitting
          </p>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;