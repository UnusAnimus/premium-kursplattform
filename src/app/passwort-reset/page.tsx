'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { PASSWORD_RESET_EXPIRY_LABEL } from '@/lib/auth-constants';

// ---------- Forgot-password form (step 1) ----------
function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json() as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-[var(--text-primary)] font-semibold text-lg mb-2">E-Mail gesendet!</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Falls ein Konto mit dieser E-Mail existiert, erhältst du in Kürze einen Link zum Zurücksetzen deines Passworts.
          Bitte prüfe auch deinen Spam-Ordner.
        </p>
        <p className="text-[var(--text-muted)] text-xs mt-4">Der Link ist {PASSWORD_RESET_EXPIRY_LABEL} gültig.</p>
        <Link href="/login" className="mt-6 inline-block text-violet-400 hover:text-violet-300 text-sm transition-colors">
          Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8">
      <h2 className="text-[var(--text-primary)] font-semibold text-lg mb-1">Passwort zurücksetzen</h2>
      <p className="text-[var(--text-secondary)] text-sm mb-6">
        Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen deines Passworts.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-Mail-Adresse"
          type="email"
          placeholder="max@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Bitte warten…
            </>
          ) : (
            'Reset-Link senden ✦'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
          Zurück zur Anmeldung
        </Link>
      </div>
    </div>
  );
}

// ---------- New-password form (step 2 – token present in URL) ----------
function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json() as { error?: string; message?: string };

      if (!res.ok) {
        setError(data.error ?? 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-[var(--text-primary)] font-semibold text-lg mb-2">Passwort geändert!</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30"
        >
          Zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8">
      <h2 className="text-[var(--text-primary)] font-semibold text-lg mb-1">Neues Passwort festlegen</h2>
      <p className="text-[var(--text-secondary)] text-sm mb-6">
        Gib dein neues Passwort ein. Es muss mindestens 8 Zeichen lang sein.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Neues Passwort"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          label="Passwort bestätigen"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Bitte warten…
            </>
          ) : (
            'Passwort speichern ✦'
          )}
        </button>
      </form>
    </div>
  );
}

// ---------- Route shell ----------
function PasswordResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return token ? <ResetPasswordForm token={token} /> : <ForgotPasswordForm />;
}

export default function PasswortResetPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-[var(--text-primary)] text-xl">Arkanum Akademie</span>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 text-center text-[var(--text-muted)]">
              Laden…
            </div>
          }
        >
          <PasswordResetContent />
        </Suspense>
      </div>
    </div>
  );
}
