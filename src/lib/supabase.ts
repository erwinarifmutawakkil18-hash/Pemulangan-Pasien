import { createClient } from '@supabase/supabase-js';
import { PatientDischarge, TppValidationData, BillingFinalizationData, RuanganItem } from '../types';

/**
 * Konfigurasi Hardcode Supabase Client sesuai permintaan pengguna.
 * URL dashboard: https://supabase.com/dashboard/project/pimcbwlfpdpzdusevult/settings/api-keys
 * Project Ref: pimcbwlfpdpzdusevult
 * API Endpoint: https://pimcbwlfpdpzdusevult.supabase.co
 * Key: sb_publishable_AS9dEZwPCWLcApYvrl9FcA_dfVQo1at
 */
export const RAW_SUPABASE_URL = 'https://supabase.com/dashboard/project/pimcbwlfpdpzdusevult/settings/api-keys';
export const SUPABASE_ANON_KEY = 'sb_publishable_AS9dEZwPCWLcApYvrl9FcA_dfVQo1at';

export function resolveSupabaseUrl(rawUrl: string): string {
  // Jika pengguna memasukkan URL dashboard, ekstrak project ID dan arahkan ke endpoint REST Supabase
  if (rawUrl.includes('dashboard/project/')) {
    const match = rawUrl.match(/project\/([a-z0-9_-]+)/i);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }
  return rawUrl.trim();
}

export const SUPABASE_URL = resolveSupabaseUrl(RAW_SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper untuk memastikan ID berbentuk UUID yang valid sebelum dikirim ke PostgreSQL
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Konversi data dari baris tabel Supabase ke format PatientDischarge aplikasi
export function mapRowToPatientDischarge(row: any): PatientDischarge {
  const tppData: TppValidationData | undefined = (row.pembiayaan || row.validated_at) ? {
    pembiayaan: row.pembiayaan || 'BPJS Kesehatan',
    hakKelas: row.hak_kelas || 'Kelas 3',
    naikKelas: Boolean(row.naik_kelas),
    kelasTingkat: row.kelas_tingkat || undefined,
    titipKelas: Boolean(row.titip_kelas),
    alasanTitip: row.alasan_titip || undefined,
    validatedAt: row.validated_at ? new Date(row.validated_at).toISOString().replace('T', ' ').slice(0, 16) : undefined,
    validatedBy: row.validated_by || undefined,
    catatanTpp: row.catatan_tpp || undefined,
  } : undefined;

  const billingData: BillingFinalizationData | undefined = (row.nomor_kuitansi || row.finalized_at) ? {
    finalizedAt: row.finalized_at ? new Date(row.finalized_at).toISOString().replace('T', ' ').slice(0, 16) : undefined,
    finalizedBy: row.finalized_by || undefined,
    nomorKuitansi: row.nomor_kuitansi || undefined,
    catatanBilling: row.catatan_billing || undefined,
  } : undefined;

  return {
    id: row.id,
    noRm: row.no_rm || '',
    namaPasien: row.nama_pasien || '',
    ruangan: row.ruangan || '',
    dpjp: row.dpjp || '',
    caraKeluar: row.cara_keluar || 'Membaik',
    waktuInputRuangan: row.waktu_input_ruangan ? new Date(row.waktu_input_ruangan).toISOString().replace('T', ' ').slice(0, 16) : new Date().toISOString().replace('T', ' ').slice(0, 16),
    petugasRuangan: row.petugas_ruangan || undefined,
    statusAlur: row.status_alur || 'menunggu_tpp',
    tppData,
    billingData,
    catatanRuangan: row.catatan_ruangan || undefined,
  };
}

// Konversi data PatientDischarge aplikasi ke baris tabel Supabase (snake_case)
export function mapPatientDischargeToRow(patient: PatientDischarge): any {
  const row: any = {
    no_rm: patient.noRm,
    nama_pasien: patient.namaPasien,
    ruangan: patient.ruangan,
    dpjp: patient.dpjp,
    caraKeluar: undefined, // ensure no collision
    cara_keluar: patient.caraKeluar,
    waktu_input_ruangan: patient.waktuInputRuangan ? new Date(patient.waktuInputRuangan.replace(' ', 'T')).toISOString() : new Date().toISOString(),
    petugas_ruangan: patient.petugasRuangan || null,
    status_alur: patient.statusAlur,
    catatan_ruangan: patient.catatanRuangan || null,
  };

  if (isValidUUID(patient.id)) {
    row.id = patient.id;
  }

  if (patient.tppData) {
    row.pembiayaan = patient.tppData.pembiayaan;
    row.hak_kelas = patient.tppData.hakKelas;
    row.naik_kelas = patient.tppData.naikKelas || false;
    row.kelas_tingkat = patient.tppData.kelasTingkat || null;
    row.titip_kelas = patient.tppData.titipKelas || false;
    row.alasan_titip = patient.tppData.alasanTitip || null;
    row.validated_at = patient.tppData.validatedAt ? new Date(patient.tppData.validatedAt.replace(' ', 'T')).toISOString() : new Date().toISOString();
    row.validated_by = patient.tppData.validatedBy || null;
    row.catatan_tpp = patient.tppData.catatanTpp || null;
  }

  if (patient.billingData) {
    row.nomor_kuitansi = patient.billingData.nomorKuitansi || null;
    row.finalized_at = patient.billingData.finalizedAt ? new Date(patient.billingData.finalizedAt.replace(' ', 'T')).toISOString() : new Date().toISOString();
    row.finalized_by = patient.billingData.finalizedBy || null;
    row.catatan_billing = patient.billingData.catatanBilling || null;
  }

  return row;
}

/**
 * Tes koneksi ke Supabase
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('master_settings').select('*').limit(1);
    if (error) {
      return { ok: false, message: error.message };
    }
    return { ok: true, message: 'Terhubung ke Supabase' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Gagal menghubungi Supabase' };
  }
}

/**
 * Mengambil seluruh pasien pemulangan dari Supabase
 */
export async function fetchDischargesFromSupabase(): Promise<PatientDischarge[]> {
  const { data, error } = await supabase
    .from('patient_discharges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Gagal mengambil data dari Supabase:', error.message);
    throw error;
  }

  return (data || []).map(mapRowToPatientDischarge);
}

/**
 * Menyimpan / memperbarui pasien pemulangan ke Supabase
 */
export async function upsertDischargeToSupabase(patient: PatientDischarge): Promise<PatientDischarge> {
  const payload = mapPatientDischargeToRow(patient);

  let query;
  if (payload.id) {
    query = supabase.from('patient_discharges').upsert(payload).select().single();
  } else {
    query = supabase.from('patient_discharges').insert([payload]).select().single();
  }

  const { data, error } = await query;
  if (error) {
    console.error('Gagal upsert ke Supabase:', error);
    throw error;
  }

  return mapRowToPatientDischarge(data);
}

/**
 * Menghapus pasien pemulangan dari Supabase
 */
export async function deleteDischargeFromSupabase(id: string): Promise<void> {
  if (!isValidUUID(id)) return;
  const { error } = await supabase.from('patient_discharges').delete().eq('id', id);
  if (error) {
    console.error('Gagal hapus dari Supabase:', error);
    throw error;
  }
}

/**
 * Mengambil daftar dokter DPJP dari Supabase
 */
export async function fetchMasterDpjpFromSupabase(): Promise<string[]> {
  const { data, error } = await supabase
    .from('master_dpjp')
    .select('nama')
    .eq('aktif', true)
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) {
    return [];
  }
  return data.map(d => d.nama);
}

/**
 * Mengambil daftar master ruangan dari Supabase
 */
export async function fetchMasterRuanganFromSupabase(): Promise<RuanganItem[]> {
  const { data, error } = await supabase
    .from('master_ruangan')
    .select('*')
    .eq('aktif', true);

  if (error || !data || data.length === 0) {
    return [];
  }

  return data.map(r => ({
    id: r.id,
    nama: r.nama,
    bangsalId: r.bangsal_id || 'general',
    kategori: r.kategori || 'Rawat Inap Reguler',
    lantai: r.lantai || 'Lantai 1',
    aktif: r.aktif ?? true
  }));
}
