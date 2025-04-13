
import React, { memo, useState, useEffect } from 'react';
import { Bell, Calendar, AlertTriangle, Link, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

export interface NotificationMessage {
  id: string;
  text: string;
  type: 'payment' | 'event' | 'inactive' | 'info';
  action?: {
    url: string;
    text: string;
  };
}

interface NotificationBannerProps {
  messages?: NotificationMessage[];
}

// Define renderIcon function outside the component
const renderIcon = (messageType: string) => {
  switch (messageType) {
    case 'payment':
      return <Bell className="h-4 w-4 mr-2 flex-shrink-0" />;
    case 'event':
      return <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />;
    case 'inactive':
      return <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />;
    case 'info':
    default:
      return <Bell className="h-4 w-4 mr-2 flex-shrink-0" />;
  }
};

// Define getBgColor function outside the component
const getBgColor = (messageType: string) => {
  switch (messageType) {
    case 'payment':
      return 'bg-amber-50 text-amber-900';
    case 'event':
      return 'bg-blue-50 text-blue-900';
    case 'inactive':
      return 'bg-red-50 text-red-900';
    case 'info':
    default:
      return 'bg-amber-50 text-amber-900';
  }
};

// Using memo to prevent unnecessary re-renders
const NotificationBanner: React.FC<NotificationBannerProps> = memo(({ messages = [] }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dismissedMessages, setDismissedMessages] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);

  // Validate messages to ensure they have required properties
  useEffect(() => {
    try {
      if (!Array.isArray(messages)) {
        console.error("NotificationBanner: messages is not an array", messages);
        setHasError(true);
        return;
      }
      
      const invalidMessages = messages.filter(msg => !msg?.id || !msg?.text);
      if (invalidMessages.length > 0) {
        console.error("NotificationBanner: invalid message format", invalidMessages);
        setHasError(true);
      } else {
        setHasError(false);
      }
    } catch (error) {
      console.error("NotificationBanner: error validating messages", error);
      setHasError(true);
    }
  }, [messages]);
  
  // Filter out dismissed messages
  const activeMessages = !hasError ? 
    messages.filter(msg => msg && !dismissedMessages.includes(msg.id)) : [];
  
  // If there are no valid messages, don't render the banner
  if (activeMessages.length === 0) {
    return null;
  }
  
  // Display only the current message with safety checks
  const currentMessage = activeMessages[currentMessageIndex];
  
  // Safety check - if currentMessage is undefined or invalid, don't render anything
  if (!currentMessage || !currentMessage.type) {
    return null;
  }
  
  const handleActionClick = () => {
    if (currentMessage.action && currentMessage.action.url) {
      window.location.href = currentMessage.action.url;
    }
  };
  
  const dismissMessage = () => {
    setDismissedMessages(prev => [...prev, currentMessage.id]);
    
    // If there are more messages, go to the next one
    if (currentMessageIndex < activeMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    }
  };
  
  // Navigate to next message if there are multiple
  const nextMessage = () => {
    if (currentMessageIndex < activeMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      setCurrentMessageIndex(0); // Loop back to first message
    }
  };
  
  try {
    return (
      <div className={`w-full ${getBgColor(currentMessage.type)} py-2 px-4 flex items-center justify-center relative transition-all`}>
        {/* Message content */}
        <div className="flex items-center justify-center flex-1 max-w-4xl">
          {renderIcon(currentMessage.type)}
          <p className="text-center text-sm">{currentMessage.text}</p>
          {currentMessage.action && (
            <button 
              onClick={handleActionClick}
              className="ml-2 font-medium underline flex items-center text-sm"
            >
              {currentMessage.action.text}
              <Link className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
        
        {/* Navigation and dismiss controls */}
        <div className="absolute right-2 flex items-center gap-2">
          {activeMessages.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextMessage}
              className="h-6 px-2 text-xs"
            >
              {currentMessageIndex + 1}/{activeMessages.length}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissMessage}
            className="h-6 w-6 p-0 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering NotificationBanner:", error);
    return null;
  }
});

// Add display name for memo component
NotificationBanner.displayName = 'NotificationBanner';

export default NotificationBanner;
