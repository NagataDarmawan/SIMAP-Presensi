'use client';

import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  type?: 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

export function ToastNotification({
  message,
  type = 'error',
  onClose,
  duration = 4000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed left-1/2 top-5 z-[70] w-full max-w-md -translate-x-1/2 px-4 animate-in fade-in slide-in-from-top-3 duration-200">
      <div
        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-xs ${
          isError
            ? 'border-rose-200 bg-rose-50/95 text-rose-800 shadow-rose-900/10'
            : 'border-emerald-200 bg-emerald-50/95 text-emerald-800 shadow-emerald-900/10'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isError ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          )}
          <p className="text-xs font-semibold leading-relaxed sm:text-sm">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 rounded-lg p-1 transition-colors ${
            isError
              ? 'text-rose-500 hover:bg-rose-100 hover:text-rose-700'
              : 'text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700'
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}