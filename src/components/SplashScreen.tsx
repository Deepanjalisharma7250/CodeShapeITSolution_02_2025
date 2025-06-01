
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300); // Small delay for smooth transition
          return 100;
        }
        return prev + 2; // Increment by 2% every 100ms for 5 second duration
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center">
      {/* Logo Images */}
      <div className="flex flex-col items-center space-y-8 mb-12">
        <div className="animate-fade-in">
          <img 
            src="/lovable-uploads/4d847d09-4306-477d-837d-e1db99e42acd.png" 
            alt="CodeShape IT Solution Logo"
            className="w-64 h-auto"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <img 
            src="/lovable-uploads/9d3ec35e-4acc-48d8-a07a-fc9d5b2bc08d.png" 
            alt="CodeShape IT Solution Text"
            className="w-80 h-auto"
          />
        </div>
      </div>

      {/* Project Title */}
      <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Automated Resume Screening System
        </h1>
        <p className="text-lg text-gray-600">
          Made by Deepanjali Sharma
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-80 bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Loading Text */}
      <p className="text-sm text-gray-500 animate-pulse">
        Loading Application...
      </p>
    </div>
  );
};

export default SplashScreen;
