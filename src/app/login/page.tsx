'use client';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

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
      setError('Die Registrierung ist derzeit nur auf Einladung verfügbar. Wende dich an den Administrator.');
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
    <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8">
      {/* Toggle */}
      <div className="flex bg-[#0a0a0f] rounded-xl p-1 mb-8">
        <button
          onClick={() => { setMode('login'); setError(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Anmelden
        </button>
        <button
          onClick={() => { setMode('register'); setError(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
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
        <Input label="E-Mail-Adresse" type="email" placeholder="max@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label="Passwort" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
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
              <span className="text-slate-400 text-sm">Angemeldet bleiben</span>
            </label>
            <a href="#" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">Passwort vergessen?</a>
          </div>
        )}

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
            mode === 'login' ? 'Jetzt anmelden ✦' : 'Konto erstellen ✦'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[#1e1e2e]" />
        <span className="text-slate-500 text-xs">oder</span>
        <div className="flex-1 h-px bg-[#1e1e2e]" />
      </div>

      {/* Social logins */}
      <div className="space-y-3">
        {[
          { icon: 'G', label: 'Mit Google fortfahren', color: 'text-red-400' },
          { icon: 'f', label: 'Mit Facebook fortfahren', color: 'text-blue-400' },
        ].map((social, i) => (
          <button
            key={i}
            disabled
            className="w-full border border-[#1e1e2e] text-slate-500 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
            title="Demnächst verfügbar"
          >
            <span className={`font-bold ${social.color}`}>{social.icon}</span>
            {social.label}
            <span className="text-xs">(bald verfügbar)</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl text-violet-400">⬡</span>
            <span className="font-bold text-white text-xl">Arkanum Akademie</span>
          </Link>
        </div>

        <Suspense fallback={<div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 text-center text-slate-400">Laden…</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-slate-500 text-xs mt-6">
          Mit der Anmeldung stimmst du unseren{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">AGB</a> und der{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">Datenschutzerklärung</a> zu.
        </p>
      </div>
    </div>
  );
}
