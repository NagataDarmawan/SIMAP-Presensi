'use client';

import { useState, useEffect } from 'react';
import { useScanAbsensi } from '@/hooks/useScanAbsensi';
import { useDashboard } from '@/hooks/useDashboard';
import ScanTerminalCard from '@/components/scan/ScanTerminalCard';
import ScanResultCard from '@/components/scan/ScanResultCard';
import LogAbsensiCard from '@/components/scan/LogAbsensiCard';

export default function ScanAbsensiPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    jenisAbsensi,
    setJenisAbsensi,
    kodeQrInput,
    setKodeQrInput,
    submitting,
    result,
    error,
    isCameraActive,
    scannerElementId,
    startCamera,
    stopCamera,
    processAbsen,
  } = useScanAbsensi();

  const { stats, loading: loadingHistory, refetch: refetchHistory } = useDashboard();

  useEffect(() => {
    if (result) refetchHistory();
  }, [result, refetchHistory]);

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 overflow-y-auto bg-slate-50 p-4 sm:p-6'
          : 'mx-auto max-w-7xl pt-1'
      }
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 md:grid-cols-2 md:items-stretch">
        {/* Kolom Kiri: Terminal Scan */}
        <ScanTerminalCard
          jenisAbsensi={jenisAbsensi}
          setJenisAbsensi={setJenisAbsensi}
          kodeQrInput={kodeQrInput}
          setKodeQrInput={setKodeQrInput}
          submitting={submitting}
          isCameraActive={isCameraActive}
          scannerElementId={scannerElementId}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          onProcessManual={processAbsen}
        />

        {/* Kolom Kanan: Hasil Scan & Log Absensi */}
        <div className="flex min-h-0 flex-col gap-3.5">
          <div className="shrink-0">
            <ScanResultCard result={result} error={error} loading={submitting} />
          </div>

          <LogAbsensiCard
            logs={stats?.recent_absensi}
            loading={loadingHistory}
            onRefresh={refetchHistory}
          />
        </div>
      </div>
    </div>
  );
}