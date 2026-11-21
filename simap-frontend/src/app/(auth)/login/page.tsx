import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      
      {/* SISI KIRI: BANNER / GAMBAR (HIDDEN DI MOBILE) */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-8 relative bg-slate-900 flex-col justify-between p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <Image
            src="/images/login-banner.jpg"
            alt="SIMAP Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-blue-950/40 z-10" />

        {/* Header / Logo */}
        <div className="relative z-20 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">SIMAP</h1>
            <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">
              Sistem Informasi Manajemen Absensi Pegawai
            </p>
          </div>
        </div>

        {/* Banner Text */}
        <div className="relative z-20 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Sistem Kehadiran & Presensi Pegawai
          </span>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Pemantauan Presensi & Data Pegawai Lebih Cepat & Terintegrasi.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Kelola kehadiran pegawai via QR Code Scanner, pantau rekapitulasi harian, dan catat permohonan izin/cuti secara real-time.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-20 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} SIMAP System</span>
          <span>Version 1.0.0</span>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-center p-6 sm:p-12 bg-white border-l border-slate-100 shadow-xl lg:shadow-none">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-2">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Masuk dengan akun administrator SIMAP Anda.
            </p>
          </div>

          {/* Render Komponen Form Terpisah */}
          <LoginForm />

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Lupa kata sandi? Hubungi Administrator Sistem.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}