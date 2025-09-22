import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Shopping bag icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full"
        >
          {/* Shopping bag body (orange) */}
          <path
            d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"
            fill="#F97316"
          />
          {/* Shopping bag handle (dark gray) */}
          <path
            d="M8 8C8 7.45 8.45 7 9 7H15C15.55 7 16 7.45 16 8V10C16 10.55 15.55 11 15 11H9C8.45 11 8 10.55 8 10V8Z"
            fill="#374151"
          />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold text-orange-500`}>
          Shopmind
        </h1>
      )}
    </div>
  );
};

export default Logo;
