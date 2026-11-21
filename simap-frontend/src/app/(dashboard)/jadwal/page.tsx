'use client';

import { useState } from 'react';
import { useJadwalKerja } from '@/hooks/useJadwalKerja';
import { JadwalKerja } from '@/types/jadwal';
import { Button } from '@/components/ui/Button';
import { CardGrid } from '@/components/ui/CardGrid';
import { SearchBar } from '@/components/ui/SearchBar';
import { HapusModal } from '@/components/ui/HapusModal';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { JadwalCard } from '@/components/jadwal/JadwalCard';
import { JadwalTable } from '@/components/jadwal/JadwalTable';
import { JadwalModal } from '@/components/jadwal/JadwalModal';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function JadwalKerjaPage() {
  const {
    loading,
    error,
    setError,
    viewMode,
    setViewMode,
    setSearchQuery,
    filteredJadwal,
    isModalOpen,
    setIsModalOpen,
    editingJadwal,
    formData,
    setFormData,
    submitting,
    handleOpenModal,
    handleSubmit,
    handleDelete,
  } = useJadwalKerja();

  const [deleteTarget, setDeleteTarget] = useState<JadwalKerja | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await handleDelete(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-[var(--text-muted)]">
        Memuat data jadwal kerja...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Jadwal Kerja</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Kelola master jam kerja, hari kerja, jam pulang, dan toleransi keterlambatan posko
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus className="mr-1.5 h-4 w-4" /> Tambah Jadwal
        </Button>
      </div>

      {/* Control Bar: Search & Layout Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Cari nama jadwal atau hari kerja..."
          onSearch={(val) => setSearchQuery(val)}
        />

        <div className="flex items-center space-x-1 rounded-lg border border-[var(--border-color)] bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[var(--brand)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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
          isEmpty={filteredJadwal.length === 0}
          emptyMessage="Data jadwal kerja tidak ditemukan."
        >
          {filteredJadwal.map((item) => (
            <JadwalCard
              key={item.id}
              item={item}
              onEdit={handleOpenModal}
              onDelete={setDeleteTarget}
            />
          ))}
        </CardGrid>
      ) : (
        <JadwalTable
          data={filteredJadwal}
          onEdit={handleOpenModal}
          onDelete={setDeleteTarget}
        />
      )}

      {/* Wrapper !mt-0 menjaga posisi fixed modal & toast tetap presisi */}
      <div className="!mt-0">
        <JadwalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingJadwal={editingJadwal}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        <HapusModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => !deleting && setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Jadwal Kerja"
          description="Apakah Anda yakin ingin menghapus jadwal kerja ini? Data yang sudah dihapus tidak dapat dikembalikan."
          itemName={deleteTarget?.nama_jadwal}
          loading={deleting}
        />

        <ToastNotification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      </div>
    </div>
  );
}