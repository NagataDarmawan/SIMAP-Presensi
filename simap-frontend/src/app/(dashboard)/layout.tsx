'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 font-medium text-slate-600">
        Memuat sesi SIMAP...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-main)]">
      {/* Sidebar */}
      <div
        className={`h-full shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <Sidebar isOpen={isSidebarOpen} onLogout={logout} />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <div className="shrink-0">
          <Navbar
            user={user}
            onLogout={logout}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        {/* Area Konten Utama */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}