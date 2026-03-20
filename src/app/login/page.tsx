'use client';
import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const target = session.user.role === 'admin' ? '/admin' : '/dashboard';
      router.replace(target);
    }
  }, [status, session, router]);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'CredentialsSignin' ? 'E-Mail oder Passwort ist falsch.' : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Die Passwörter stimmen nicht überein.');
        return;
      }
      if (password.length < 8) {
        setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json() as { error?: string };

        if (!res.ok) {
          setError(data.error ?? 'Registrierung fehlgeschlagen.');
          return;
        }

        // Auto-login after successful registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError('Registrierung erfolgreich, aber automatische Anmeldung fehlgeschlagen. Bitte melde dich manuell an.');
          setMode('login');
        } else if (result?.url) {
          router.push(result.url);
        }
      } catch {
        setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('E-Mail oder Passwort ist falsch.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8">
      {/* Toggle */}
      <div className="flex bg-[var(--bg-base)] rounded-xl p-1 mb-8">
        <button
          onClick={() => { setMode('login'); setError(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-violet-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          Anmelden
        </button>
        <button
          onClick={() => { setMode('register'); setError(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-violet-600 text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          Registrieren
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <Input label="Vollständiger Name" type="text" placeholder="Max Mustermann" value={name} onChange={e => setName(e.target.value)} required />
        )}
        <Input label="E-Mail-Adresse" type="email" placeholder="max@example.com" value={email} onChange={e => setEmail(e.target.value)} required data-testid="login-email" />
        <Input label="Passwort" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required data-testid="login-password" />
        {mode === 'register' && (
          <Input label="Passwort bestätigen" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-violet-600"
              />
              <span className="text-[var(--text-secondary)] text-sm">Angemeldet bleiben</span>
            </label>
            <Link href="/passwort-reset" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">Passwort vergessen?</Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          data-testid="login-submit"
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Bitte warten…
            </>
          ) : (
            mode === 'login' ? 'Jetzt anmelden ✦' : 'Konto erstellen ✦'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[var(--border-base)]" />
        <span className="text-[var(--text-muted)] text-xs">oder</span>
        <div className="flex-1 h-px bg-[var(--border-base)]" />
      </div>

      {/* Social logins */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full border border-[var(--border-base)] text-[var(--text-primary)] hover:border-violet-500/50 hover:bg-violet-500/5 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 transition-all"
        >
          <span className="font-bold text-red-400">G</span>
          Mit Google fortfahren
        </button>
        <button
          type="button"
          disabled
          className="w-full border border-[var(--border-base)] text-[var(--text-muted)] py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
          title="Demnächst verfügbar"
        >
          <span className="font-bold text-blue-400">f</span>
          Mit Facebook fortfahren
          <span className="text-xs">(bald verfügbar)</span>
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
      {/* Background */}
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

        <Suspense fallback={<div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 text-center text-[var(--text-muted)]">Laden…</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-[var(--text-muted)] text-xs mt-6">
          Mit der Anmeldung stimmst du unseren{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">AGB</a> und der{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">Datenschutzerklärung</a> zu.
        </p>
      </div>
    </div>
  );
}
