export type RoleType = 'ruangan' | 'tpp' | 'billing' | 'admin';

export type BangsalId = 
  | 'general'
  | 'maternal'
  | 'paviliun_bedah'
  | 'anak'
  | 'kamar_bersalin'
  | 'intensive'
  | 'neonatologi';

export interface BangsalItem {
  id: BangsalId;
  nama: string; // Misal: "General", "Maternal", dll.
  keterangan?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  namaLengkap: string;
  role: RoleType;
  bangsalId?: BangsalId;
  ruangan?: string;
  waktuLogin: string;
}

export interface UserAccountCredential {
  id: string;
  username: string;
  nama: string;
  pin: string;
  role: RoleType;
  bangsalId?: BangsalId;
  ruanganDefault?: string;
}

export const DAFTAR_BANGSAL: BangsalItem[] = [
  { id: 'general', nama: 'General', keterangan: 'Cempaka 1-4, Bougenvile 1-2, Asoka 1-3, Tulip 3-4, Lily' },
  { id: 'maternal', nama: 'Maternal', keterangan: 'Dahlia 1-4, Melati 1-3, Kenanga 1-2, Tulip 1' },
  { id: 'paviliun_bedah', nama: 'Paviliun & Bedah', keterangan: 'Anggrek 1-5, Mawar 1-3, Edelweis 1-2' },
  { id: 'anak', nama: 'Anak', keterangan: 'Panda 1-3, Pinguin 1-4, Kelinci 1-2, Tulip 5-6' },
  { id: 'kamar_bersalin', nama: 'Kamar Bersalin', keterangan: 'Observasi 1, R. Tindakan' },
  { id: 'intensive', nama: 'Intensive', keterangan: 'HCU, ICU, PICU' },
  { id: 'neonatologi', nama: 'Neonatologi', keterangan: 'Neonatologi 1-2, NICU, Tulip 2' }
];

export const DEFAULT_USER_ACCOUNTS: UserAccountCredential[] = [
  // 7 Akun User R. (Ruang Rawat Inap)
  {
    id: 'user_bangsal_general',
    username: 'r_general',
    nama: 'R. General',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'general',
    ruanganDefault: 'Cempaka 1'
  },
  {
    id: 'user_bangsal_maternal',
    username: 'r_maternal',
    nama: 'R. Maternal',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'maternal',
    ruanganDefault: 'Dahlia 1'
  },
  {
    id: 'user_bangsal_paviliun_bedah',
    username: 'r_paviliun_bedah',
    nama: 'R. Paviliun & Bedah',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'paviliun_bedah',
    ruanganDefault: 'Anggrek 1'
  },
  {
    id: 'user_bangsal_anak',
    username: 'r_anak',
    nama: 'R. Anak',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'anak',
    ruanganDefault: 'Panda 1'
  },
  {
    id: 'user_bangsal_kamar_bersalin',
    username: 'r_bersalin',
    nama: 'R. Kamar Bersalin',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'kamar_bersalin',
    ruanganDefault: 'Observasi 1'
  },
  {
    id: 'user_bangsal_intensive',
    username: 'r_intensive',
    nama: 'R. Intensive',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'intensive',
    ruanganDefault: 'ICU'
  },
  {
    id: 'user_bangsal_neonatologi',
    username: 'r_neonatologi',
    nama: 'R. Neonatologi',
    pin: '1234',
    role: 'ruangan',
    bangsalId: 'neonatologi',
    ruanganDefault: 'Neonatologi 1'
  },
  // Unit TPP, Billing, Admin
  {
    id: 'user_tpp',
    username: 'tpp',
    nama: 'TPP & Informasi',
    pin: '1234',
    role: 'tpp'
  },
  {
    id: 'user_billing',
    username: 'billing',
    nama: 'Billing & Kasir',
    pin: '1234',
    role: 'billing'
  },
  {
    id: 'user_admin',
    username: 'admin',
    nama: 'Administrator RS',
    pin: '1234',
    role: 'admin'
  }
];

export type KategoriRuangan = 
  | 'Rawat Inap Reguler'
  | 'VIP / VVIP'
  | 'Perawatan Intensif (ICU/ICCU/PICU/NICU)'
  | 'Kebidanan / Bersalin'
  | 'Isolasi Khusus';

export interface RuanganItem {
  id: string;
  nama: string;
  bangsalId: BangsalId;
  kategori: KategoriRuangan;
  lantai?: string;
  aktif: boolean;
}

export interface MasterSettings {
  adminPin: string; // PIN pengaman masuk tab Admin
  kunciAksesRuangan: boolean; // Jika aktif, hanya ruangan terpilih yang bisa input
  daftarRuangan: RuanganItem[];
  daftarDpjp: string[];
  daftarCaraKeluar: string[];
  daftarPembiayaan: string[];
  daftarHakKelas: string[];
}

export type CaraKeluar = 
  | 'Persetujuan Dokter / Sembuh'
  | 'Membaik'
  | 'Atas Permintaan Sendiri (APS)'
  | 'Rujuk ke RS Lain'
  | 'Meninggal < 48 Jam'
  | 'Meninggal >= 48 Jam'
  | 'Lain-lain / Melarikan Diri';

export type PembiayaanType = 
  | 'BPJS Kesehatan'
  | 'Umum / Mandiri'
  | 'Asuransi Swasta'
  | 'Jaminan Perusahaan'
  | 'Jamkesda / SPM';

export type HakKelasType = 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'VIP' | 'VVIP';

export const DAFTAR_DPJP: string[] = [
  'dr. Totok Mardiyanto, Sp. B',
  'dr. Budi Setiawan, Sp. B',
  'dr. Nanik Triana Kartikasari, Sp. PD',
  'dr. Vonny Mariany Deckert, Sp.A., M. Biomed',
  'dr. Nur Rochmah Kusuma Rahayu, Sp.A',
  'dr. Rahajeng Ayu Pramudita, Sp. OG',
  'dr. Siti Aisyah, Sp. OG',
  'dr. Kresna Nugraha Sp, Sp.JP',
  'dr. Eko Prasetyo, Sp. OT',
  'dr. Dewi Sartika, Sp. S',
  'dr. Andi Wijaya, Sp. P',
  'dr. Hendra Kusuma, Sp. THT-KL',
  'dr. Maya Indriani, Sp. M',
  'dr. Rizky Pratama, Sp. An',
  'dr. Wahyu Hidayat, Sp. Rad'
];

export const DAFTAR_CARA_KELUAR: CaraKeluar[] = [
  'Persetujuan Dokter / Sembuh',
  'Membaik',
  'Atas Permintaan Sendiri (APS)',
  'Rujuk ke RS Lain',
  'Meninggal < 48 Jam',
  'Meninggal >= 48 Jam',
  'Lain-lain / Melarikan Diri'
];

export const DAFTAR_PEMBIAYAAN: PembiayaanType[] = [
  'BPJS Kesehatan',
  'Umum / Mandiri',
  'Asuransi Swasta',
  'Jaminan Perusahaan',
  'Jamkesda / SPM'
];

export const DAFTAR_HAK_KELAS: HakKelasType[] = [
  'Kelas 1',
  'Kelas 2',
  'Kelas 3',
  'VIP',
  'VVIP'
];

export type StatusAlur = 
  | 'menunggu_tpp'        // Baru diinput ruangan, menunggu validasi TPP
  | 'menunggu_billing'    // Sudah divalidasi TPP, menunggu finalisasi Billing
  | 'selesai';            // Sudah difinalisasi Billing

export interface TppValidationData {
  pembiayaan: PembiayaanType;
  hakKelas: HakKelasType;
  naikKelas: boolean;
  kelasTingkat?: string; // misalnya: 'Naik ke VIP'
  titipKelas: boolean;
  alasanTitip?: string; // misalnya: 'Kamar kelas 2 penuh'
  validatedAt?: string;
  validatedBy?: string;
  catatanTpp?: string;
}

export interface BillingFinalizationData {
  finalizedAt?: string;
  finalizedBy?: string;
  nomorKuitansi?: string;
  catatanBilling?: string;
}

export interface PatientDischarge {
  id: string;
  noRm: string; // 6 digit, e.g. 021458
  namaPasien: string;
  ruangan: string;
  dpjp: string;
  caraKeluar: CaraKeluar;
  
  // Waktu input ruangan
  waktuInputRuangan: string;
  petugasRuangan?: string;

  // Status Alur
  statusAlur: StatusAlur;

  // Data dari TPP & Informasi
  tppData?: TppValidationData;

  // Data dari Billing
  billingData?: BillingFinalizationData;

  // Catatan umum
  catatanRuangan?: string;
}

export const DEFAULT_RUANGAN_ITEMS: RuanganItem[] = [
  // 1. Bangsal General
  { id: 'rng-gen-1', nama: 'Cempaka 1', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-gen-2', nama: 'Cempaka 2', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-gen-3', nama: 'Cempaka 3', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-gen-4', nama: 'Cempaka 4', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-gen-5', nama: 'Bougenvile 1', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-gen-6', nama: 'Bougenvile 2', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-gen-7', nama: 'Asoka 1', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-gen-8', nama: 'Asoka 2', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-gen-9', nama: 'Asoka 3', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-gen-10', nama: 'Tulip 3', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-gen-11', nama: 'Tulip 4', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-gen-12', nama: 'Lily', bangsalId: 'general', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },

  // 2. Bangsal Maternal
  { id: 'rng-mat-1', nama: 'Dahlia 1', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-2', nama: 'Dahlia 2', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-3', nama: 'Dahlia 3', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-4', nama: 'Dahlia 4', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-5', nama: 'Melati 1', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-6', nama: 'Melati 2', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-7', nama: 'Melati 3', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-mat-8', nama: 'Kenanga 1', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-mat-9', nama: 'Kenanga 2', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-mat-10', nama: 'Tulip 1', bangsalId: 'maternal', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 3', aktif: true },

  // 3. Bangsal Paviliun & Bedah
  { id: 'rng-pbd-1', nama: 'Anggrek 1', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-2', nama: 'Anggrek 2', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-3', nama: 'Anggrek 3', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-4', nama: 'Anggrek 4', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-5', nama: 'Anggrek 5', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-6', nama: 'Mawar 1', bangsalId: 'paviliun_bedah', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-7', nama: 'Mawar 2', bangsalId: 'paviliun_bedah', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-8', nama: 'Mawar 3', bangsalId: 'paviliun_bedah', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-pbd-9', nama: 'Edelweis 1', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 4', aktif: true },
  { id: 'rng-pbd-10', nama: 'Edelweis 2', bangsalId: 'paviliun_bedah', kategori: 'VIP / VVIP', lantai: 'Lantai 4', aktif: true },

  // 4. Bangsal Anak
  { id: 'rng-ank-1', nama: 'Panda 1', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-2', nama: 'Panda 2', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-3', nama: 'Panda 3', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-4', nama: 'Pinguin 1', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-5', nama: 'Pinguin 2', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-6', nama: 'Pinguin 3', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-7', nama: 'Pinguin 4', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-8', nama: 'Kelinci 1', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-9', nama: 'Kelinci 2', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-10', nama: 'Tulip 5', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-ank-11', nama: 'Tulip 6', bangsalId: 'anak', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },

  // 5. Kamar Bersalin
  { id: 'rng-kbs-1', nama: 'Observasi 1', bangsalId: 'kamar_bersalin', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-kbs-2', nama: 'R. Tindakan', bangsalId: 'kamar_bersalin', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 1', aktif: true },

  // 6. Intensive
  { id: 'rng-int-1', nama: 'HCU', bangsalId: 'intensive', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-int-2', nama: 'ICU', bangsalId: 'intensive', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-int-3', nama: 'PICU', bangsalId: 'intensive', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },

  // 7. Neonatologi
  { id: 'rng-neo-1', nama: 'Neonatologi 1', bangsalId: 'neonatologi', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-neo-2', nama: 'Neonatologi 2', bangsalId: 'neonatologi', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-neo-3', nama: 'NICU', bangsalId: 'neonatologi', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-neo-4', nama: 'Tulip 2', bangsalId: 'neonatologi', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true }
];

export const DAFTAR_RUANGAN: string[] = DEFAULT_RUANGAN_ITEMS.map(r => r.nama);

export const DEFAULT_MASTER_SETTINGS: MasterSettings = {
  adminPin: '1234',
  kunciAksesRuangan: false,
  daftarRuangan: DEFAULT_RUANGAN_ITEMS,
  daftarDpjp: DAFTAR_DPJP,
  daftarCaraKeluar: DAFTAR_CARA_KELUAR,
  daftarPembiayaan: DAFTAR_PEMBIAYAAN,
  daftarHakKelas: DAFTAR_HAK_KELAS
};

export const DUMMY_PATIENTS: PatientDischarge[] = [
  {
    id: 'pt-1',
    noRm: '021458',
    namaPasien: 'Budi Santoso',
    ruangan: 'Cempaka 1',
    dpjp: 'dr. Nanik Triana Kartikasari, Sp. PD',
    caraKeluar: 'Membaik',
    waktuInputRuangan: '2026-09-17 08:30',
    petugasRuangan: 'Ns. Siti Aminah, S.Kep',
    statusAlur: 'selesai',
    tppData: {
      pembiayaan: 'BPJS Kesehatan',
      hakKelas: 'Kelas 2',
      naikKelas: false,
      titipKelas: false,
      validatedAt: '2026-09-17 09:15',
      validatedBy: 'Petugas TPP (Rian)',
      catatanTpp: 'SEP BPJS telah diverifikasi online dan terbit.'
    },
    billingData: {
      finalizedAt: '2026-09-17 10:45',
      finalizedBy: 'Kasir Billing (Ibu Endang)',
      nomorKuitansi: 'KWT/2026/09/0812',
      catatanBilling: 'Klaim BPJS disetujui, iur biaya Rp 0, rincian biaya sudah dicetak.'
    },
    catatanRuangan: 'Surat kontrol poli penyakit dalam tgl 24 September 2026.'
  },
  {
    id: 'pt-2',
    noRm: '018942',
    namaPasien: 'Hj. Rohanah',
    ruangan: 'Dahlia 1',
    dpjp: 'dr. Kresna Nugraha Sp, Sp.JP',
    caraKeluar: 'Persetujuan Dokter / Sembuh',
    waktuInputRuangan: '2026-09-17 10:00',
    petugasRuangan: 'Ns. Rizky, Amd.Kep',
    statusAlur: 'menunggu_billing',
    tppData: {
      pembiayaan: 'BPJS Kesehatan',
      hakKelas: 'Kelas 1',
      naikKelas: true,
      kelasTingkat: 'Naik ke VIP (Atas Permintaan Pasien)',
      titipKelas: false,
      validatedAt: '2026-09-17 10:30',
      validatedBy: 'Petugas TPP (Bayu)',
      catatanTpp: 'Ada selisih biaya naik kelas dari Kelas 1 ke VIP, keluarga sudah tanda tangan form persetujuan.'
    },
    catatanRuangan: 'Infus sudah dilepas, obat pulang sudah siap.'
  },
  {
    id: 'pt-3',
    noRm: '034119',
    namaPasien: 'Ananda Kevin Alvaro',
    ruangan: 'Panda 1',
    dpjp: 'dr. Vonny Mariany Deckert, Sp.A., M. Biomed',
    caraKeluar: 'Persetujuan Dokter / Sembuh',
    waktuInputRuangan: '2026-09-17 11:15',
    petugasRuangan: 'Ns. Dewi Lestari, S.Kep',
    statusAlur: 'menunggu_tpp',
    catatanRuangan: 'Pasien bebas demam 24 jam, trombosit 185.000.'
  },
  {
    id: 'pt-4',
    noRm: '009821',
    namaPasien: 'Hendra Gunawan',
    ruangan: 'Anggrek 1',
    dpjp: 'dr. Totok Mardiyanto, Sp. B',
    caraKeluar: 'Atas Permintaan Sendiri (APS)',
    waktuInputRuangan: '2026-09-17 11:45',
    petugasRuangan: 'Ns. Taufik, S.Kep',
    statusAlur: 'menunggu_tpp',
    catatanRuangan: 'Keluarga meminta rawat jalan di klinik dekat rumah, surat pernyataan APS sudah ditandatangani bermaterai.'
  },
  {
    id: 'pt-5',
    noRm: '028712',
    namaPasien: 'Ny. Siti Nurhaliza',
    ruangan: 'Observasi 1',
    dpjp: 'dr. Siti Aisyah, Sp. OG',
    caraKeluar: 'Persetujuan Dokter / Sembuh',
    waktuInputRuangan: '2026-09-17 12:30',
    petugasRuangan: 'Bdn. Ratna, S.Tr.Keb',
    statusAlur: 'menunggu_tpp',
    catatanRuangan: 'Pasca partus spontan, kondisi ibu dan bayi stabil, edukasi ASI eksklusif selesai.'
  }
];
