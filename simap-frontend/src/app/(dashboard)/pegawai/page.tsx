'use client';

import { useState } from 'react';
import { usePegawai } from '@/hooks/usePegawai';
import { Pegawai } from '@/types/pegawai';
import { Button } from '@/components/ui/Button';
import { CardGrid } from '@/components/ui/CardGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { Filter } from '@/components/ui/Filter';
import { HapusModal } from '@/components/ui/HapusModal';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { PegawaiCard } from '@/components/pegawai/PegawaiCard';
import { PegawaiTable } from '@/components/pegawai/PegawaiTable';
import { PegawaiModal } from '@/components/pegawai/PegawaiModal';
import { StatusPegawaiModal } from '@/components/pegawai/StatusPegawaiModal';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function PegawaiPage() {
  const {
    loading,
    error,
    setError,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    filteredPegawai,
    jadwalOptions,
    isModalOpen,
    setIsModalOpen,
    editingPegawai,
    formData,
    setFormData,
    submitting,
    getJadwalNama,
    setSearchQuery,
    handleOpenModal,
    handleSubmit,
    handleToggleStatus,
    handleDelete,
  } = usePegawai();

  const [deleteTarget, setDeleteTarget] = useState<Pegawai | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [statusTarget, setStatusTarget] = useState<Pegawai | null>(null);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmStatus = async () => {
    if (!statusTarget) return;
    setTogglingStatus(true);
    try {
      await handleToggleStatus(statusTarget);
      setStatusTarget(null);
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-slate-600">
        Memuat data pegawai...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Data Pegawai</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Kelola data master pegawai, jabatan, status keaktifan, dan QR Code ID Card
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Pegawai
        </Button>
      </div>

      {/* Control Bar: Search, Filter, & Layout Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <SearchBar
            placeholder="Cari nama, kode, atau jabatan..."
            onSearch={(val) => setSearchQuery(val)}
          />
          <Filter
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'Semua Status', value: '' },
              { label: 'Aktif', value: 'AKTIF' },
              { label: 'Non-Aktif', value: 'NONAKTIF' },
            ]}
          />
        </div>

        {/* Switcher Layout */}
        <div className="flex items-center space-x-1 rounded-lg border border-[var(--border-color)] bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[var(--brand)] shadow-sm'
                : 'text-slate-600 hover:text-[var(--text-main)]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Grid Card</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-[var(--brand)] shadow-sm'
                : 'text-slate-600 hover:text-[var(--text-main)]'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Tabel</span>
          </button>
        </div>
      </div>

      {/* Render Komponen Sesuai ViewMode */}
      {viewMode === 'grid' ? (
        <CardGrid
          cols={3}
          isEmpty={filteredPegawai.length === 0}
          emptyMessage="Data pegawai tidak ditemukan."
        >
          {filteredPegawai.map((item) => (
            <PegawaiCard
              key={item.id}
              item={item}
              jadwalNama={getJadwalNama(item.jadwal_kerja_id)}
              onEdit={handleOpenModal}
              onToggleStatus={setStatusTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </CardGrid>
      ) : (
        <PegawaiTable
          data={filteredPegawai}
          getJadwalNama={getJadwalNama}
          onEdit={handleOpenModal}
          onToggleStatus={setStatusTarget}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Wrapper !mt-0 mencegah space-y-6 mendorong posisi fixed modal & toast ke bawah */}
      <div className="!mt-0">
        {/* Modal Form Pegawai */}
        <PegawaiModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingPegawai={editingPegawai}
          formData={formData}
          setFormData={setFormData}
          jadwalOptions={jadwalOptions}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        {/* Modal Konfirmasi Nonaktifkan / Aktifkan Pegawai */}
        <StatusPegawaiModal
          isOpen={Boolean(statusTarget)}
          onClose={() => !togglingStatus && setStatusTarget(null)}
          onConfirm={handleConfirmStatus}
          pegawai={statusTarget}
          loading={togglingStatus}
        />

        {/* Modal Konfirmasi Hapus */}
        <HapusModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => !deleting && setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Data Pegawai"
          description="Apakah Anda yakin ingin menghapus data pegawai ini? Seluruh data terkait pegawai tersebut akan terpengaruh dan tidak dapat dikembalikan."
          itemName={
            deleteTarget?.nama
              ? `${deleteTarget.nama}${deleteTarget.kode_pegawai ? ` (${deleteTarget.kode_pegawai})` : ''}`
              : undefined
          }
          loading={deleting}
        />

        {/* Notifikasi Melayang Tengah Atas */}
        <ToastNotification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      </div>
    </div>
  );
}