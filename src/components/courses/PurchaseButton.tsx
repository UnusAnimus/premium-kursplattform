'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PurchaseButtonProps {
  courseSlug: string;
  firstLessonId: string | null;
}

export function PurchaseButton({ courseSlug, firstLessonId }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug }),
      });

      // 409 = already enrolled → still navigate to course
      if (res.ok || res.status === 409) {
        const target = firstLessonId
          ? `/kurse/${courseSlug}/lektion/${firstLessonId}`
          : `/kurse/${courseSlug}`;
        router.push(target);
        router.refresh();
      } else {
        const json = await res.json() as { error?: string };
        setError(json.error ?? 'Kauf fehlgeschlagen. Bitte versuche es erneut.');
        setLoading(false);
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
      )}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 cursor-pointer text-lg"
      >
        {loading ? 'Wird verarbeitet…' : 'Jetzt kaufen ✦'}
      </button>
    </div>
  );
}
