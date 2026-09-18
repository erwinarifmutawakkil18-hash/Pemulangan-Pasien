export type RoleType = 'ruangan' | 'tpp' | 'billing' | 'admin';

export type KategoriRuangan = 
  | 'Rawat Inap Reguler'
  | 'VIP / VVIP'
  | 'Perawatan Intensif (ICU/ICCU/PICU/NICU)'
  | 'Kebidanan / Bersalin'
  | 'Isolasi Khusus';

export interface RuanganItem {
  id: string;
  nama: string;
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
  | 'Membaik (Rawat Jalan)'
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

export const DAFTAR_RUANGAN: string[] = [
  'Ruang Melati (Lantai 2)',
  'Ruang Mawar (Lantai 2)',
  'Ruang Dahlia (Lantai 3)',
  'Ruang Flamboyan (Lantai 3)',
  'Ruang Kenanga (Lantai 4)',
  'Ruang Anggrek VIP (Lantai 4)',
  'Ruang Teratai VVIP (Lantai 5)',
  'ICU (Intensive Care Unit)',
  'ICCU (Intensive Cardiac Care)',
  'NICU / PICU',
  'Ruang Kebidanan & Bersalin (VK)'
];

export const DAFTAR_DPJP: string[] = [
  'dr. Hendra Pratama, Sp.PD (Penyakit Dalam)',
  'dr. Maya Anggraini, Sp.B (Bedah Umum)',
  'dr. Bambang Irawan, Sp.JP (Jantung & Pembuluh Darah)',
  'dr. Fitriani, Sp.OG (Kebidanan & Kandungan)',
  'dr. Agus Setiawan, Sp.A (Anak)',
  'dr. Ratna Dewi, Sp.S (Saraf / Neurologi)',
  'dr. Dian Kusuma, Sp.OT (Ortopedi & Traumatologi)',
  'dr. Eko Wahyudi, Sp.P (Paru & Pernapasan)',
  'dr. Rini Suryani, Sp.M (Mata)',
  'dr. Taufik Hidayat, Sp.THT-KL (THT)'
];

export const DAFTAR_CARA_KELUAR: CaraKeluar[] = [
  'Persetujuan Dokter / Sembuh',
  'Membaik (Rawat Jalan)',
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

export const DEFAULT_RUANGAN_ITEMS: RuanganItem[] = [
  { id: 'rng-1', nama: 'Ruang Melati (Kelas 2 & 3)', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-2', nama: 'Ruang Mawar (Kelas 1 & 2)', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-3', nama: 'Ruang Dahlia (Kelas 1 & VIP)', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-4', nama: 'Ruang Flamboyan (Anak)', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-5', nama: 'Ruang Kenanga (Bedah)', kategori: 'Rawat Inap Reguler', lantai: 'Lantai 4', aktif: true },
  { id: 'rng-6', nama: 'Ruang Anggrek VIP', kategori: 'VIP / VVIP', lantai: 'Lantai 4', aktif: true },
  { id: 'rng-7', nama: 'Ruang Teratai VVIP & Presidential', kategori: 'VIP / VVIP', lantai: 'Lantai 5', aktif: true },
  { id: 'rng-8', nama: 'ICU (Intensive Care Unit)', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-9', nama: 'ICCU (Intensive Cardiac Care Unit)', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 2', aktif: true },
  { id: 'rng-10', nama: 'NICU / PICU (Neonatal/Pediatric)', kategori: 'Perawatan Intensif (ICU/ICCU/PICU/NICU)', lantai: 'Lantai 3', aktif: true },
  { id: 'rng-11', nama: 'Ruang Kebidanan & Bersalin (VK)', kategori: 'Kebidanan / Bersalin', lantai: 'Lantai 1', aktif: true },
  { id: 'rng-12', nama: 'Ruang Isolasi Tekanan Negatif', kategori: 'Isolasi Khusus', lantai: 'Lantai 1', aktif: true }
];

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
    ruangan: 'Ruang Melati (Lantai 2)',
    dpjp: 'dr. Hendra Pratama, Sp.PD (Penyakit Dalam)',
    caraKeluar: 'Membaik (Rawat Jalan)',
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
    ruangan: 'Ruang Dahlia (Lantai 3)',
    dpjp: 'dr. Bambang Irawan, Sp.JP (Jantung & Pembuluh Darah)',
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
    ruangan: 'Ruang Mawar (Lantai 2)',
    dpjp: 'dr. Agus Setiawan, Sp.A (Anak)',
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
    ruangan: 'Ruang Kenanga (Lantai 4)',
    dpjp: 'dr. Maya Anggraini, Sp.B (Bedah Umum)',
    caraKeluar: 'Atas Permintaan Sendiri (APS)',
    waktuInputRuangan: '2026-09-17 11:45',
    petugasRuangan: 'Ns. Taufik, S.Kep',
    statusAlur: 'menunggu_tpp',
    catatanRuangan: 'Keluarga meminta rawat jalan di klinik dekat rumah, surat pernyataan APS sudah ditandatangani bermaterai.'
  }
];
