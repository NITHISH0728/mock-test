import { useState, useEffect, useRef } from 'react';

interface AntiCheatOptions {
  maxTabSwitches?: number;
  maxFullscreenEscapes?: number;
  onTerminate: (reason: string) => void;
  onWarning: (reason: string, warningsLeft: number) => void;
}

export function useAntiCheat({ 
  maxTabSwitches = 2, 
  maxFullscreenEscapes = 2, 
  onTerminate, 
  onWarning 
}: AntiCheatOptions) {
  
  const [tabSwitches, setTabSwitches] = useState(0);
  const [fullscreenEscapes, setFullscreenEscapes] = useState(0);
  const isTerminated = useRef(false);

  // Focus and Blur tracking (Tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isTerminated.current) {
        setTabSwitches(prev => {
          const newCount = prev + 1;
          if (newCount > maxTabSwitches) {
            isTerminated.current = true;
            onTerminate('Exceeded maximum allowed tab switches.');
          } else {
            onWarning('You switched tabs! This is a violation.', maxTabSwitches - newCount + 1);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [maxTabSwitches, onTerminate, onWarning]);

  // Full Screen Tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isTerminated.current) {
        setFullscreenEscapes(prev => {
          const newCount = prev + 1;
          if (newCount > maxFullscreenEscapes) {
            isTerminated.current = true;
            onTerminate('Exceeded maximum allowed full-screen escapes.');
          } else {
            onWarning('You exited full-screen! This is a violation. Please return to full screen immediately.', maxFullscreenEscapes - newCount + 1);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [maxFullscreenEscapes, onTerminate, onWarning]);

  // Enter full screen helper
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.warn("Fullscreen permission denied or not supported by browser", e);
      });
    }
  };

  return {
    tabSwitches,
    fullscreenEscapes,
    enterFullscreen
  };
}
