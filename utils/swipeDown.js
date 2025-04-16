import { useRef, useState, useEffect } from 'react';

const useSwipeDown = (onSwipeDown, onClick, ms = 1500) => {
  const [startY, setStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Track if the device is mobile
  const [hasInteracted, setHasInteracted] = useState(false); // To track if user has interacted

  const timerRef = useRef(null);

  // Check if the device supports touch events
  useEffect(() => {
    if ('ontouchstart' in window) {
      setIsMobile(true);
    }
  }, []);

  const startPress = (e) => {
    // Only trigger if it's a mobile device
    if (!isMobile) return;

    // Prevent default to avoid conflicts with other touch/mouse actions
    e.preventDefault();

    const touchStart = e.touches ? e.touches[0] : e; // Handle touch or mouse events
    setStartY(touchStart.clientY); // Save the initial Y position
    setIsSwiping(false);
    setHasInteracted(true); // Mark as interacted when user starts press

    // Removed the setTimeout for closing modal automatically
    // timerRef.current = setTimeout(() => {
    //   if (onClick) {
    //     onClick(); // Trigger onClick if no swipe happens within ms
    //   }
    // }, ms); // Trigger click event if swipe doesn't happen within `ms` milliseconds
  };

  const movePress = (e) => {
    if (!isMobile) return; // Ensure it only works on mobile

    const touchMove = e.touches ? e.touches[0] : e;
    const distance = touchMove.clientY - startY; // Calculate distance moved vertically

    if (distance > 50) { // Minimum distance for swipe down
      setIsSwiping(true);
      clearTimeout(timerRef.current); // Clear click timeout if swipe is detected

      if (onSwipeDown) {
        onSwipeDown(); // Trigger swipe down callback
      }
    }
  };

  const endPress = () => {
    setIsSwiping(false);
    clearTimeout(timerRef.current);
  };

  const handleTouchCancel = () => {
    setIsSwiping(false);
    clearTimeout(timerRef.current);
  };

  const handleMouseEnter = () => {
    // Prevent modal from closing when mouse enters
    setHasInteracted(true); // User has interacted, so don't trigger automatic closing
  };

  const handleMouseLeave = () => {
    // Don't trigger closing automatically when mouse leaves
    if (!hasInteracted) {
      // Only close if user hasn't interacted
      if (onClick) {
        onClick(); // Or any close behavior
      }
    }
  };

  return {
    onTouchStart: startPress,
    onTouchMove: movePress,
    onTouchEnd: endPress,
    onTouchCancel: handleTouchCancel,
    onMouseDown: startPress,
    onMouseMove: movePress,
    onMouseUp: endPress,
    onMouseEnter: handleMouseEnter, // Prevent modal from closing on hover
    onMouseLeave: handleMouseLeave, // Prevent modal from closing on mouse leave
  };
};

export default useSwipeDown;
