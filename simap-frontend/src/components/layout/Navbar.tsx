'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, User, Menu, LogOut } from 'lucide-react';
import { Admin } from '@/types/auth';

interface NavbarProps {
  user: Admin | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const PATH_MAP: Record<string, { category: string; title: string }> = {
  '/': { category: 'Utama', title: 'Dashboard' },
  '/jadwal': { category: 'Master Data', title: 'Jadwal Kerja' },
  '/pegawai': { category: 'Master Data', title: 'Data Pegawai' },
  '/qr-code': { category: 'Master Data', title: 'Cetak QR Code' },
  '/scan': { category: 'Presensi', title: 'Scan Presensi' },
  '/riwayat': { category: 'Presensi', title: 'Riwayat Presensi' },
  '/izin-cuti': { category: 'Presensi', title: 'Izin & Cuti' },
  '/rekap': { category: 'Laporan & Monitoring', title: 'Rekap Kehadiran' },
  '/monitoring': { category: 'Laporan & Monitoring', title: 'Monitoring Kedisiplinan' },
};

export default function Navbar({
  user,
  onLogout,
  onToggleSidebar,
  isSidebarOpen,
}: NavbarProps) {
  const pathname = usePathname();
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setTime(new Date());
    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPathInfo = PATH_MAP[pathname] || {
    category: 'SIMAP',
    title: 'Halaman Admin',
  };

  const todayFormatted = time
    ? new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(time)
    : '';

  const timeFormatted = time
    ? time.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--:--';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-color)] bg-white px-4 sm:px-6">
      {/* Dynamic Breadcrumb + Toggle Button */}
      <div className="flex min-w-0 items-center space-x-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          title={isSidebarOpen ? 'Ciutkan Sidebar' : 'Buka Sidebar'}
          aria-label={isSidebarOpen ? 'Ciutkan Sidebar' : 'Buka Sidebar'}
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center space-x-2 text-sm font-medium text-[var(--text-muted)]"
        >
          <span className="hidden truncate sm:inline">{currentPathInfo.category}</span>
          <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-400 sm:inline" />
          <span className="truncate font-bold text-[var(--text-main)]">
            {currentPathInfo.title}
          </span>
        </nav>
      </div>

      {/* Tanggal, Jam, Profile Pill & Logout */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        <div className="hidden items-center space-x-2.5 text-xs font-semibold text-slate-600 lg:flex">
          <span>{todayFormatted}</span>
          <span className="text-slate-300">|</span>
          <span className="tabular-nums">{timeFormatted} WIB</span>
        </div>

        <div className="flex items-center space-x-2.5 rounded-full border border-[var(--border-color)] bg-slate-50 py-1 pl-1 pr-3.5 shadow-2xs">
          <div className="simap-avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase">
            {user?.nama ? user.nama.charAt(0) : <User className="h-4 w-4" />}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-bold leading-tight text-[var(--text-main)]">
              {user?.nama || 'Admin SIMAP'}
            </p>
            <p className="text-[10px] font-medium leading-tight text-[var(--text-muted)]">
              Administrator
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          title="Keluar dari Aplikasi"
          aria-label="Keluar dari Aplikasi"
          className="rounded-lg border border-transparent p-2 text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}