import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MicrophoneIcon, StopIcon, SpeakerWaveIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const VoiceAssistant: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Voice Recognition Not Supported
          </h3>
          <p className="text-gray-500">
            Your browser doesn't support speech recognition. 
            Try using Chrome or Edge for the voice feature.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            You can still type your questions below!
          </p>
        </div>
      </div>
    );
  }

  const startListening = () => {
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = async () => {
    SpeechRecognition.stopListening();
    setIsListening(false);

    if (transcript && transcript.trim()) {
      await sendMessage(transcript);
      resetTranscript();
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to backend
      const response = await api.post('/voice/ask', { message });
      
      // Add AI response to conversation
      const aiMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);

      // Speak the response
      speakText(response.data.response);
    } catch (error) {
      console.error('Voice assistant error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    // Use browser's speech synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = async () => {
    try {
      await api.delete('/voice/history');
      setConversation([]);
      resetTranscript();
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6" />
            <h2 className="text-xl font-bold">AI Voice Assistant</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        <p className="text-sm text-blue-100 mt-1">
          Ask me anything about your studies!
        </p>
      </div>

      {/* Conversation Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {conversation.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <MicrophoneIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Ready to help you study!
              </h3>
              <p className="text-gray-500 text-sm">
                Click the microphone button and start talking, or type your question below.
              </p>
              <div className="mt-4 space-y-2 text-xs text-gray-400">
                <p>Try asking: "Explain photosynthesis"</p>
                <p>Or: "Help me with algebra"</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {conversation.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Live Transcript */}
            {transcript && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-blue-100 text-blue-800 border-2 border-blue-300 rounded-br-none">
                  <p className="text-sm">{transcript}</p>
                  <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {!isListening ? (
              <button
                onClick={startListening}
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <MicrophoneIcon className="w-5 h-5" />
                <span className="font-medium">Start Talking</span>
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg animate-pulse"
              >
                <StopIcon className="w-5 h-5" />
                <span className="font-medium">Stop</span>
              </button>
            )}

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <SpeakerWaveIcon className="w-5 h-5" />
                <span className="text-sm">Mute</span>
              </button>
            )}
          </div>

          {conversation.length > 0 && (
            <button
              onClick={clearConversation}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-center justify-center space-x-2">
          {isListening && (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </>
          )}
          {isSpeaking && !isListening && (
            <>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Speaking...</span>
            </>
          )}
          {!isListening && !isSpeaking && !isLoading && (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Ready to help you study!</span>
            </>
          )}
          {isLoading && (
            <>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Thinking...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
