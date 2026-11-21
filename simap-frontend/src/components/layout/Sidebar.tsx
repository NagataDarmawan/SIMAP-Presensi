"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  QrCode,
  ScanLine,
  ClipboardCheck,
  History,
  FileSpreadsheet,
  FileCheck,
  BarChart3,
  LogOut,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface MenuGroup {
  category: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    category: "Utama",
    items: [{ name: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    category: "Master Data",
    items: [
      { name: "Jadwal Kerja", path: "/jadwal", icon: Calendar },
      { name: "Data Pegawai", path: "/pegawai", icon: Users },
      { name: "Cetak QR Code", path: "/qr-code", icon: QrCode },
    ],
  },
  {
    category: "Presensi",
    items: [
      { name: "Scan Presensi", path: "/scan", icon: ScanLine },
      { name: "Presensi Harian", path: "/presensi-harian", icon: ClipboardCheck },
      { name: "Riwayat Presensi", path: "/riwayat", icon: History },
      { name: "Izin & Cuti", path: "/izin-cuti", icon: FileSpreadsheet },
    ],
  },
  {
    category: "Laporan & Monitoring",
    items: [
      { name: "Rekap Kehadiran", path: "/rekap", icon: FileCheck },
      { name: "Monitoring Kedisiplinan", path: "/monitoring", icon: BarChart3 },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="simap-sidebar flex h-full shrink-0 flex-col justify-between p-3">
      <div className="w-full">
        {/* Brand Header */}
        <div
          className={`mb-6 flex items-center ${isOpen ? "px-2" : "justify-center"}`}
        >
          {isOpen ? (
            <div>
              <h1 className="simap-sidebar-title text-xl font-bold tracking-wide">
                SIMAP Admin
              </h1>
              <p className="text-xs text-slate-400">Sistem Presensi</p>
            </div>
          ) : (
            <div className="simap-sidebar-icon flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold">
              S
            </div>
          )}
        </div>

        {/* Menu Groups */}
        <nav className="sidebar-scroll max-h-[calc(100vh-160px)] space-y-6 overflow-y-auto pr-1">
          {MENU_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              {isOpen ? (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.category}
                </p>
              ) : (
                <div className="my-2 h-px w-full bg-slate-800" />
              )}

              {group.items.map(({ name, path, icon: Icon }) => {
                const isActive = pathname === path;

                return (
                  <Link
                    key={path}
                    href={path}
                    title={!isOpen ? name : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isOpen ? "justify-start" : "justify-center"
                    } ${
                      isActive
                        ? "simap-nav-active font-semibold shadow-sm"
                        : "simap-nav-inactive"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    {isOpen && <span className="truncate">{name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="w-full border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={onLogout}
          title={!isOpen ? "Keluar (Logout)" : undefined}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0 text-rose-400" />
          {isOpen && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}