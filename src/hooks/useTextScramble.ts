import { useEffect, useRef } from 'react';

export const useTextScramble = () => {
  const scramble = (element: HTMLElement, finalText: string) => {
    // Store original content and dimensions
    const originalWidth = element.getBoundingClientRect().width;
    const originalHeight = element.getBoundingClientRect().height;
    
    // Lock dimensions to prevent layout shift
    element.style.display = 'inline-block';
    element.style.width = `${originalWidth}px`;
    element.style.height = `${originalHeight}px`;
    element.style.overflow = 'hidden';
    
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;
    const speed = 30;
    
    const interval = setInterval(() => {
      element.innerText = finalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return finalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iteration >= finalText.length) {
        clearInterval(interval);
        // Reset styles after animation
        element.style.width = '';
        element.style.height = '';
        element.style.overflow = '';
      }
      
      iteration += 1 / 3;
    }, speed);
  };

  return { scramble };
};