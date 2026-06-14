import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { ToastType } from '../context/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start exit animation slightly before it's actually removed from DOM
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />,
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: <XCircle className="text-red-500 flex-shrink-0" size={20} />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="text-blue-500 flex-shrink-0" size={20} />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ease-in-out
        ${isClosing ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}
        ${styles.bg} ${styles.text}`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {styles.icon}
      <p className="text-sm font-medium pr-4">{message}</p>
      <button
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
        className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
