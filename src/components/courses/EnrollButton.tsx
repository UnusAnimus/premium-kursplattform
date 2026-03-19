'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EnrollButtonProps {
  courseSlug: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  firstLessonId?: string | null;
}

export function EnrollButton({ courseSlug, isLoggedIn, isEnrolled, firstLessonId }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const router = useRouter();

  const lessonHref = firstLessonId
    ? `/kurse/${courseSlug}/lektion/${firstLessonId}`
    : `/kurse/${courseSlug}`;

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30"
      >
        Jetzt einschreiben ✦
      </Link>
    );
  }

  if (enrolled) {
    return (
      <Link
        href={lessonHref}
        className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30"
      >
        Kurs fortsetzen ✦
      </Link>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug }),
      });

      if (res.ok || res.status === 409) {
        setEnrolled(true);
        router.refresh();
      } else {
        const json = await res.json() as { error?: string };
        setError(json.error ?? 'Einschreibung fehlgeschlagen.');
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p className="text-red-400 text-xs mb-2 text-center">{error}</p>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="block w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 cursor-pointer"
      >
        {loading ? 'Bitte warten…' : 'Jetzt einschreiben ✦'}
      </button>
    </div>
  );
}
