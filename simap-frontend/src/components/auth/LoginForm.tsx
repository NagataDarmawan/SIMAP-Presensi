'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login({ username, password });
      if (res.success) {
        // Redirect bersih ke halaman utama dashboard (/)
        window.location.replace('/');
      } else {
        setError(res.message || 'Login gagal');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal terhubung ke server Express');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 rounded-xl border border-rose-200 animate-in fade-in duration-200">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="h-4 w-4" />
          </div>
          <input
            type="text"
            required
            placeholder="Masukkan username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all font-medium"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Masukkan password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full py-2.5 text-xs font-bold bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white rounded-xl shadow-md shadow-[var(--brand)]/20 flex items-center justify-center space-x-2 transition-all mt-2"
        isLoading={loading}
      >
        <span>{loading ? 'Memproses...' : 'Masuk Ke Dashboard'}</span>
        {!loading && <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}