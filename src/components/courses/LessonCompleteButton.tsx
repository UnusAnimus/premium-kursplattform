'use client';
import { useState } from 'react';

interface LessonCompleteButtonProps {
  lessonId: string;
  initialCompleted: boolean;
}

export function LessonCompleteButton({ lessonId, initialCompleted }: LessonCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const method = completed ? 'DELETE' : 'POST';
      const res = await fetch(`/api/lessons/${lessonId}/complete`, { method });
      if (res.ok) {
        setCompleted(prev => !prev);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
        completed
          ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
          : 'bg-[#13131a] border border-[#1e1e2e] hover:border-violet-500/50 text-slate-300 hover:text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        <span>{completed ? '✓' : '○'}</span>
      )}
      {completed ? 'Abgeschlossen' : 'Als abgeschlossen markieren'}
    </button>
  );
}
