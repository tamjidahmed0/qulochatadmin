import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog Panel */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#121214] border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800/60 flex items-center justify-between bg-slate-50/60 dark:bg-zinc-950/40">
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[85vh] overflow-y-auto text-slate-700 dark:text-zinc-300">{children}</div>
      </div>
    </div>
  );
};
