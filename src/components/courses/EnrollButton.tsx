'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EnrollButtonProps {
  courseSlug: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  price: number;
  firstLessonId?: string | null;
}

export function EnrollButton({ courseSlug, isLoggedIn, isEnrolled, price, firstLessonId }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const router = useRouter();

  const lessonHref = firstLessonId
    ? `/kurse/${courseSlug}/lektion/${firstLessonId}`
    : `/kurse/${courseSlug}`;

  const isPaid = price > 0;

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?callbackUrl=/kurse/${courseSlug}`}
        className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 mb-3"
      >
        {isPaid ? 'Jetzt kaufen ✦' : 'Jetzt einschreiben ✦'}
      </Link>
    );
  }

  if (enrolled) {
    return (
      <Link
        href={lessonHref}
        className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 mb-3"
      >
        Kurs fortsetzen ✦
      </Link>
    );
  }

  // Paid course → redirect to checkout page
  if (isPaid) {
    return (
      <Link
        href={`/kurse/${courseSlug}/checkout`}
        className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 mb-3"
      >
        Jetzt kaufen ✦
      </Link>
    );
  }

  // Free course → enroll directly
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
    <div className="mb-3">
      {error && (
        <p className="text-red-400 text-xs mb-2 text-center">{error}</p>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="block w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 cursor-pointer"
      >
        {loading ? 'Bitte warten…' : 'Kostenlos einschreiben ✦'}
      </button>
    </div>
  );
}
