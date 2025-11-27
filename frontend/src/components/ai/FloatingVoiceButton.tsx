import React, { useState } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import VoiceAssistant from './VoiceAssistant';

export const FloatingVoiceButton: React.FC = () => {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowVoiceAssistant(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center group"
        title="Voice Assistant"
      >
        <MicrophoneIcon className="w-8 h-8 group-hover:animate-pulse" />
        
        {/* Ping animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>
      </button>

      {/* Voice Assistant Modal */}
      {showVoiceAssistant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowVoiceAssistant(false)}
          ></div>
          <div className="relative w-full max-w-2xl h-[600px] animate-slide-up">
            <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingVoiceButton;
