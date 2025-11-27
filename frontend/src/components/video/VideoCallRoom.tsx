import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Video Call Room Component
 * 
 * Supports multiple video call providers:
 * 1. Daily.co (Recommended)
 * 2. Jitsi Meet (Free, unlimited)
 * 3. Whereby (Simple iframe)
 * 
 * Change VIDEO_PROVIDER below to switch between providers
 */

type VideoProvider = 'daily' | 'jitsi' | 'whereby';

const VIDEO_PROVIDER: VideoProvider = 'jitsi'; // Change this to switch providers

interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

export const VideoCallRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [callActive, setCallActive] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (roomId && user) {
      initializeCall();
    }
    
    return () => {
      leaveCall();
    };
  }, [roomId, user]);

  const initializeCall = () => {
    setCallActive(true);
  };

  const leaveCall = () => {
    setCallActive(false);
    navigate('/study-groups');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/video-call/${roomId}`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied to clipboard!');
  };

  const renderVideoProvider = () => {
    const userName = `${user?.firstName} ${user?.lastName}`;
    
    switch (VIDEO_PROVIDER) {
      case 'jitsi':
        return (
          <iframe
            ref={iframeRef}
            src={`https://meet.jit.si/${roomId}#userInfo.displayName="${userName}"&config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
            allow="camera; microphone; fullscreen; display-capture"
            className="w-full h-full rounded-lg"
            title="Video Call"
          />
        );
        
      case 'whereby':
        return (
          <iframe
            ref={iframeRef}
            src={`https://whereby.com/${roomId}?displayName=${userName}&background=off`}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="w-full h-full rounded-lg"
            title="Video Call"
          />
        );
        
      case 'daily':
        const dailyDomain = process.env.REACT_APP_DAILY_DOMAIN || 'your-domain.daily.co';
        return (
          <iframe
            ref={iframeRef}
            src={`https://${dailyDomain}/${roomId}?userName=${userName}`}
            allow="camera; microphone; fullscreen; speaker; display-capture"
            className="w-full h-full rounded-lg"
            title="Video Call"
          />
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-secondary-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              Video provider not configured
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 p-4">
        <div className="h-full bg-black rounded-lg overflow-hidden relative">
          {renderVideoProvider()}
          
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <VideoCameraIcon className="h-5 w-5" />
              <span className="text-sm">{participants.length || 1} participant(s)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 text-white">
            <h3 className="font-semibold">Study Room: {roomId?.slice(0, 8)}</h3>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-colors ${
                isAudioOn
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isAudioOn ? 'Mute' : 'Unmute'}
            >
              <MicrophoneIcon className={`h-6 w-6 text-white ${!isAudioOn && 'line-through'}`} />
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              title={isVideoOn ? 'Stop Video' : 'Start Video'}
            >
              <VideoCameraIcon className={`h-6 w-6 text-white ${!isVideoOn && 'line-through'}`} />
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-colors ${
                isScreenSharing
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Share Screen"
            >
              <ComputerDesktopIcon className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={leaveCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              title="Leave Call"
            >
              <PhoneXMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Toggle Chat"
            >
              <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={copyInviteLink}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Copy Invite Link"
            >
              <UserPlusIcon className="h-5 w-5 text-white" />
            </button>

            <button
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 text-white text-center py-2 text-sm">
        Using {VIDEO_PROVIDER === 'jitsi' ? 'Jitsi Meet' : VIDEO_PROVIDER === 'whereby' ? 'Whereby' : 'Daily.co'} 
        {VIDEO_PROVIDER === 'jitsi' && ' (Free, Unlimited)'}
        {VIDEO_PROVIDER === 'whereby' && ' (Free up to 4 participants)'}
        {VIDEO_PROVIDER === 'daily' && ' (Requires API key)'}
      </div>
    </div>
  );
};

export default VideoCallRoom;
