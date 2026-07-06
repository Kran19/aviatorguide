"use client"

import React, { useEffect, useState } from "react"

export function ScrambleText({ text, className }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text.replace(/./g, " "))
  
  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    
    interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (letter === " ") return " ";
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
      });
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 2; // speed of scramble resolution
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>
}
