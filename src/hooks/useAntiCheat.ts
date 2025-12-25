import { useEffect, useCallback, useRef } from 'react';

interface UseAntiCheatOptions {
  onViolation: (type: string) => void;
  enabled: boolean;
}

export const useAntiCheat = ({ onViolation, enabled }: UseAntiCheatOptions) => {
  const violationTriggered = useRef(false);

  const handleViolation = useCallback((type: string) => {
    if (!violationTriggered.current && enabled) {
      violationTriggered.current = true;
      onViolation(type);
    }
  }, [onViolation, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Reset violation flag when enabled changes
    violationTriggered.current = false;

    // Visibility change detection (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('tab_switch');
      }
    };

    // Window blur detection (clicking outside browser)
    const handleBlur = () => {
      handleViolation('window_blur');
    };

    // Detect if page loses focus
    const handlePageHide = () => {
      handleViolation('page_hide');
    };

    // Prevent right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent common keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+Tab, Alt+Tab detection (can't prevent, but can detect focus loss)
      // Prevent F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        handleViolation('devtools_attempt');
      }
      // Prevent Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        handleViolation('devtools_attempt');
      }
      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        handleViolation('view_source_attempt');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleViolation]);

  return {
    resetViolation: () => {
      violationTriggered.current = false;
    }
  };
};
