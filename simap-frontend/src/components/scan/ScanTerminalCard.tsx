'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  QrCode,
  Camera,
  CameraOff,
  LogIn,
  LogOut,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ScanTerminalCardProps {
  jenisAbsensi: 'MASUK' | 'PULANG';
  setJenisAbsensi: (jenis: 'MASUK' | 'PULANG') => void;
  kodeQrInput: string;
  setKodeQrInput: (val: string) => void;
  submitting: boolean;
  isCameraActive: boolean;
  scannerElementId: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onProcessManual: (kode: string) => void;
}

export default function ScanTerminalCard({
  jenisAbsensi,
  setJenisAbsensi,
  kodeQrInput,
  setKodeQrInput,
  submitting,
  isCameraActive,
  scannerElementId,
  isFullscreen,
  onToggleFullscreen,
  onStartCamera,
  onStopCamera,
  onProcessManual,
}: ScanTerminalCardProps) {
  const isMasuk = jenisAbsensi === 'MASUK';

  return (
    <Card className="flex flex-col space-y-3.5 p-4">
      {/* 1. Pilihan Masuk / Pulang */}
      <div className="space-y-1.5 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center justify-between">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-main)]">
            Pilih Jenis Absensi <span className="text-[var(--danger)]">*</span>
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isMasuk ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            Mode: {jenisAbsensi}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--border-color)] bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setJenisAbsensi('MASUK')}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition-all ${
              isMasuk
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-[var(--text-main)]'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>MASUK</span>
          </button>

          <button
            type="button"
            onClick={() => setJenisAbsensi('PULANG')}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition-all ${
              !isMasuk
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-[var(--text-main)]'
            }`}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>PULANG</span>
          </button>
        </div>
      </div>

      {/* 2. Kamera Pemindai */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            Kamera Pemindai
          </span>

          <div className="flex items-center gap-1.5">
            {!isCameraActive ? (
              <Button size="sm" variant="primary" onClick={onStartCamera}>
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Nyalakan Kamera
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="border-rose-200 text-rose-600"
                onClick={onStopCamera}
              >
                <CameraOff className="mr-1.5 h-3.5 w-3.5" /> Matikan
              </Button>
            )}

            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Minimize (Tampilkan Menu)' : 'Mode Layar Penuh'}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5 text-[var(--brand)]" />
              )}
            </button>
          </div>
        </div>

        {/* Area Video (Styling video langsung via Tailwind arbitrary selector) */}
        <div
          id={scannerElementId}
          className={`relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-lg border border-[var(--border-color)] bg-black [&_video]:h-full! [&_video]:w-full! [&_video]:rounded-lg [&_video]:object-cover! ${
            isCameraActive ? 'block' : 'hidden'
          }`}
        />

        {!isCameraActive && (
          <div className="mx-auto flex aspect-4/3 w-full max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-color)] bg-slate-50 p-6 text-center">
            <QrCode className="mb-2 h-12 w-12 text-slate-300" />
            <span className="text-xs font-medium text-[var(--text-main)]">
              Kamera Pemindai Nonaktif
            </span>
            <span className="mt-0.5 max-w-xs text-[11px] text-[var(--text-muted)]">
              Klik tombol <strong>Nyalakan Kamera</strong> untuk mulai memindai ID Card.
            </span>
          </div>
        )}
      </div>

      {/* 3. Form Input Manual */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onProcessManual(kodeQrInput);
        }}
        className="space-y-2.5 border-t border-[var(--border-color)] pt-3"
      >
        <Input
          placeholder="Input Kode Pegawai (contoh: K9X4M2)..."
          value={kodeQrInput}
          onChange={(e) => setKodeQrInput(e.target.value)}
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full text-xs font-bold shadow-sm"
          isLoading={submitting}
        >
          Proses Manual ({jenisAbsensi})
        </Button>
      </form>
    </Card>
  );
}