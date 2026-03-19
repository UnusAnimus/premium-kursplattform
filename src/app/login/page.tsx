'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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

        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8">
          {/* Toggle */}
          <div className="flex bg-[#0a0a0f] rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Anmelden
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Registrieren
            </button>
          </div>

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
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30"
            >
              {mode === 'login' ? 'Jetzt anmelden ✦' : 'Konto erstellen ✦'}
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
                className="w-full border border-[#1e1e2e] hover:border-violet-500/50 text-slate-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3"
              >
                <span className={`font-bold ${social.color}`}>{social.icon}</span>
                {social.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Mit der Anmeldung stimmst du unseren{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">AGB</a> und der{' '}
          <a href="#" className="text-violet-400 hover:text-violet-300">Datenschutzerklärung</a> zu.
        </p>
      </div>
    </div>
  );
}
