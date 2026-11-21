export interface QRCodeData {
  id: number;
  pegawai_id?: number;
  pegawaiId?: number;
  id_pegawai?: number;
  token_hash?: string;
  raw_token?: string;
  rawToken?: string;
  kode_qr?: string;
  qr_code?: string;
  qr_image?: string;
  qr_code_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  pegawai?: {
    id?: number;
    kode_pegawai?: string;
    nama?: string;
    jabatan?: string;
  };
}