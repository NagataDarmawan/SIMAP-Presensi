'use client';

import { useCetakQr } from '@/hooks/useCetakQr';
import { IdCardTemplate } from '@/components/qr/IdCardTemplate';
import { QrPrintArea } from '@/components/qr/QrPrintArea';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Printer, CheckSquare, Square, LayoutGrid, FileText } from 'lucide-react';

export default function CetakQrPage() {
  const {
    loading,
    filteredPegawai,
    setSearchQuery,
    selectedIds,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    printMode,
    setPrintMode,
    pegawaiToPrint,
    handlePrint,
  } = useCetakQr();

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-[var(--text-muted)]">
        Memuat data ID Card pegawai...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Baris 1: Header Judul & Tombol Aksi Utama Cetak */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Cetak ID Card & QR Code</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Pilih pegawai atau cetak seluruh kartu ID Card siap potong
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handlePrint}
          disabled={pegawaiToPrint.length === 0}
          className="shrink-0"
        >
          <Printer className="mr-1.5 h-4 w-4" />
          <span>
            Cetak ID Card ({selectedIds.length > 0 ? `${selectedIds.length} Terpilih` : 'Semua'})
          </span>
        </Button>
      </div>

      {/* Baris 2: Control Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div className="w-full lg:max-w-xs">
          <SearchBar
            placeholder="Cari nama, kode pegawai, atau jabatan..."
            onSearch={(val) => setSearchQuery(val)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switcher Mode Cetak */}
          <div className="flex items-center space-x-1 rounded-lg border border-[var(--border-color)] bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setPrintMode('grid')}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                printMode === 'grid'
                  ? 'bg-white text-[var(--brand)] shadow-sm'
                  : 'text-slate-600 hover:text-[var(--text-main)]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Multi / Lembar</span>
            </button>
            <button
              type="button"
              onClick={() => setPrintMode('single')}
              className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                printMode === 'single'
                  ? 'bg-white text-[var(--brand)] shadow-sm'
                  : 'text-slate-600 hover:text-[var(--text-main)]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>1 Kartu / Lembar</span>
            </button>
          </div>

          {/* Tombol Pilih Semua */}
          <Button type="button" variant="outline" onClick={toggleSelectAll}>
            {isAllSelected ? (
              <>
                <CheckSquare className="mr-1.5 h-4 w-4 text-[var(--brand)]" />
                <span>Batal Pilih Semua</span>
              </>
            ) : (
              <>
                <Square className="mr-1.5 h-4 w-4" />
                <span>Pilih Semua ({filteredPegawai.length})</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Grid ID Card di Layar */}
      {filteredPegawai.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-color)] bg-white p-12 text-center text-sm text-[var(--text-muted)] print:hidden">
          Data pegawai tidak ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 print:hidden">
          {filteredPegawai.map((pegawai) => {
            const isSelected = selectedIds.includes(pegawai.id);
            return (
              <div
                key={pegawai.id}
                onClick={() => toggleSelect(pegawai.id)}
                className={`group relative flex cursor-pointer flex-col items-center rounded-2xl border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-[var(--brand)] bg-[var(--brand-light)]/50 shadow-sm'
                    : 'border-[var(--border-color)] bg-white hover:border-slate-300'
                }`}
              >
                <div className="mb-2 flex w-full items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">
                    {isSelected ? 'Terpilih untuk dicetak' : 'Klik untuk pilih'}
                  </span>
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 text-[var(--brand)]" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
                  )}
                </div>

                <IdCardTemplate pegawai={pegawai} />
              </div>
            );
          })}
        </div>
      )}

      {/* Area Khusus Cetak */}
      <QrPrintArea pegawaiList={pegawaiToPrint} printMode={printMode} />
    </div>
  );
}