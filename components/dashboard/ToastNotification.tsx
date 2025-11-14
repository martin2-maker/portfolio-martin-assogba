import React, { useState, useEffect } from 'react';

interface ToastNotificationProps {
    message: string;
    icon: string;
    color: string;
    onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, icon, color, onClose }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timerDuration = 4000;
        
        const timer = setTimeout(() => {
            onClose();
        }, timerDuration);

        const interval = setInterval(() => {
            setProgress(prev => {
                const nextProgress = prev - (100 / (timerDuration / 100));
                if (nextProgress <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return nextProgress;
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onClose]);

    return (
        <div 
            className="flex items-start gap-4 bg-[#1E2A38] text-white p-4 rounded-lg shadow-2xl border-l-4 w-full max-w-sm animate-fade-in-right"
            style={{ borderLeftColor: color }}
        >
            <div className="text-xl pt-1">{icon}</div>
            <div className="flex-1">
                <p className="font-bold text-sm">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            <div className="absolute bottom-0 left-0 h-1 bg-white/30" style={{ width: `${progress}%`, backgroundColor: color, transition: 'width 0.1s linear' }}></div>
        </div>
    );
};

export default ToastNotification;