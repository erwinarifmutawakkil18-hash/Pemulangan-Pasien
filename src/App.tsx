import React, { useState, useEffect } from 'react';
import { 
  PatientDischarge, RoleType, DUMMY_PATIENTS, 
  TppValidationData, BillingFinalizationData,
  MasterSettings, DEFAULT_MASTER_SETTINGS
} from './types';
import { RoleNavbar } from './components/RoleNavbar';
import { PatientDischargeTable } from './components/PatientDischargeTable';
import { RuanganInputModal } from './components/RuanganInputModal';
import { TppValidationModal } from './components/TppValidationModal';
import { BillingFinalizeModal } from './components/BillingFinalizeModal';
import { DischargeTrackingDetailModal } from './components/DischargeTrackingDetailModal';
import { AdminSettingsView } from './components/AdminSettingsView';
import { 
  Building2, CreditCard, Receipt, CheckCircle2, 
  Clock, ShieldCheck, Download, Upload, Info 
} from 'lucide-react';

const STORAGE_KEY = 'sim_pemulangan_pasien_3level_v2';
const SETTINGS_STORAGE_KEY = 'sim_master_settings_v1';

export default function App() {
  const [patients, setPatients] = useState<PatientDischarge[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca data localStorage, menggunakan data default.', e);
    }
    return DUMMY_PATIENTS;
  });

  const [masterSettings, setMasterSettings] = useState<MasterSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca master settings, memakai default.');
    }
    return DEFAULT_MASTER_SETTINGS;
  });

  const [activeRole, setActiveRole] = useState<RoleType | 'monitor'>('ruangan');
  const [selectedRuangan, setSelectedRuangan] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu_tpp' | 'menunggu_billing' | 'selesai'>('all');

  // Modals state
  const [isInputRuanganOpen, setIsInputRuanganOpen] = useState(false);
  const [selectedTppPatient, setSelectedTppPatient] = useState<PatientDischarge | null>(null);
  const [selectedBillingPatient, setSelectedBillingPatient] = useState<PatientDischarge | null>(null);
  const [selectedDetailPatient, setSelectedDetailPatient] = useState<PatientDischarge | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync patients to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Gagal menyimpan ke localStorage:', e);
    }
  }, [patients]);

  // Sync masterSettings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(masterSettings));
    } catch (e) {
      console.error('Gagal menyimpan settings ke localStorage:', e);
    }
  }, [masterSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Input Pasien dari Ruangan
  const handleAddPatientFromRuangan = (newPatient: PatientDischarge) => {
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Pasien ${newPatient.namaPasien} (RM: ${newPatient.noRm}) berhasil dikirim ke antrean TPP & Informasi.`);
  };

  // 2. Validasi dari TPP & Informasi
  const handleValidateTpp = (patientId: string, tppData: TppValidationData) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            tppData,
            statusAlur: p.statusAlur === 'selesai' ? 'selesai' : 'menunggu_billing',
          };
        }
        return p;
      })
    );
    showToast(`Data TPP berhasil divalidasi dan diteruskan ke antrean Kasir Billing.`);
  };

  // 3. Finalisasi dari Kasir Billing
  const handleFinalizeBilling = (patientId: string, billingData: BillingFinalizationData) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            billingData,
            statusAlur: 'selesai',
          };
        }
        return p;
      })
    );
    showToast(`Pemulangan pasien berhasil difinalisasi oleh Billing! Status kini selesai di semua level.`);
  };

  // Reset data ke default
  const handleResetData = () => {
    if (window.confirm('Reset data ke daftar pasien contoh awal?')) {
      setPatients(DUMMY_PATIENTS);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Data berhasil direset.');
    }
  };

  // Ekspor data ke JSON (bisa disimpan di Google Drive)
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_pasien_pulang_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File cadangan data berhasil diunduh. Anda dapat menyimpannya di Google Drive!');
  };

  // Impor file cadangan JSON dari Drive / Komputer
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setPatients(parsed);
            showToast('Data berhasil dipulihkan dari file cadangan.');
          } else {
            alert('Format file tidak valid.');
          }
        } catch (err) {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  // Filter pasien berdasarkan role, ruangan, status alur, dan pencarian No RM / Nama
  const filteredPatients = patients
    .filter((patient) => {
      // Search match: No RM (6 digit), Nama, DPJP, Ruangan
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        patient.noRm.includes(query) ||
        patient.namaPasien.toLowerCase().includes(query) ||
        patient.dpjp.toLowerCase().includes(query) ||
        patient.ruangan.toLowerCase().includes(query);

      // Ruangan filter match
      const matchesRuangan =
        selectedRuangan === 'all' || patient.ruangan === selectedRuangan;

      // Status filter match
      const matchesStatus =
        statusFilter === 'all' || patient.statusAlur === statusFilter;

      return matchesSearch && matchesRuangan && matchesStatus;
    })
    .sort((a, b) => {
      // Prioritaskan status: Menunggu TPP (teratas / ranking 1), lalu Menunggu Billing (ranking 2), lalu Selesai (ranking 3)
      const getPriority = (status: string) => {
        if (status === 'menunggu_tpp') return 1;
        if (status === 'menunggu_billing') return 2;
        return 3;
      };

      const diff = getPriority(a.statusAlur) - getPriority(b.statusAlur);
      if (diff !== 0) return diff;

      // Jika prioritas sama, urutkan berdasarkan waktu input terbaru
      return b.waktuInputRuangan.localeCompare(a.waktuInputRuangan);
    });

  // KPI Counts
  const countMenungguTpp = patients.filter((p) => p.statusAlur === 'menunggu_tpp').length;
  const countMenungguBilling = patients.filter((p) => p.statusAlur === 'menunggu_billing').length;
  const countSelesai = patients.filter((p) => p.statusAlur === 'selesai').length;
  const totalPasien = patients.length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased font-sans flex flex-col selection:bg-teal-100 selection:text-teal-900">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Role Switcher & Search Bar */}
        <RoleNavbar
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          selectedRuangan={selectedRuangan}
          onRuanganChange={setSelectedRuangan}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenInputRuangan={() => setIsInputRuanganOpen(true)}
          onResetData={handleResetData}
          countMenungguTpp={countMenungguTpp}
          countMenungguBilling={countMenungguBilling}
          countSelesai={countSelesai}
          totalPasien={totalPasien}
          ruanganList={masterSettings.daftarRuangan}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Master & Hak Akses Administrator View */}
        {activeRole === 'admin' ? (
          <AdminSettingsView
            settings={masterSettings}
            onSaveSettings={(newSettings) => {
              setMasterSettings(newSettings);
              showToast('Pengaturan master dropdown dan hak akses berhasil diperbarui.');
            }}
            onCloseAdmin={() => setActiveRole('ruangan')}
          />
        ) : (
          <>
            {/* Informative Workflow Banner for Active Role */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-slate-900 block">
                    {activeRole === 'ruangan' && 'Peran: Ruang Rawat Inap (Nurse Station)'}
                    {activeRole === 'tpp' && 'Peran: TPP dan Informasi (Tempat Pendaftaran Pasien & Admisi)'}
                    {activeRole === 'billing' && 'Peran: Kasir & Verifikasi Billing'}
                    {activeRole === 'monitor' && 'Mode Pantauan Terpadu Antar-Unit'}
                  </strong>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    {activeRole === 'ruangan' &&
                      'Ruangan menginput No. RM 6 Digit, Nama, DPJP, dan Cara Keluar. Ruangan dapat memantau status secara langsung apakah sudah divalidasi oleh TPP dan difinalisasi oleh Billing.'}
                    {activeRole === 'tpp' &&
                      'TPP menerima antrean dari ruangan, kemudian mengisi Pembiayaan (BPJS/Umum/dsb), Hak Kelas (1-3, VIP, VVIP), Naik Kelas (Ya/Tidak), dan Titip Kelas (Ya/Tidak) lalu memvalidasi ke Billing.'}
                    {activeRole === 'billing' &&
                      'Billing menerima pasien yang telah divalidasi TPP untuk memeriksa penyelesaian klaim dan rincian biaya, lalu mengeklik tombol "Finalisasi Pemulangan".'}
                    {activeRole === 'monitor' &&
                      'Menampilkan seluruh perjalanan pemulangan pasien mulai dari input ruangan, verifikasi penjaminan TPP, hingga pelunasan billing kasir.'}
                  </p>
                </div>
              </div>

              {/* Backup & Drive integration controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={handleExportBackup}
                  title="Unduh file backup untuk disimpan di Google Drive Anda"
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cadangkan ke Drive (JSON)</span>
                </button>

                <label
                  title="Muat data dari file cadangan Google Drive"
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pulihkan</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Main Patient Table with Integrated Status */}
            <PatientDischargeTable
              patients={filteredPatients}
              activeRole={activeRole}
              onSelectPatientDetail={(p) => setSelectedDetailPatient(p)}
              onOpenTppModal={(p) => setSelectedTppPatient(p)}
              onOpenBillingModal={(p) => setSelectedBillingPatient(p)}
            />

            {/* 3-Level Workflow Visual Guide */}
            <section className="bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Alur Pemulangan Pasien Rumah Sakit yang Saling Terhubung:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Step 1 */}
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200/60 space-y-1.5">
                  <div className="font-bold text-teal-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-[11px] flex items-center justify-center font-bold">
                      1
                    </span>
                    Ruangan Rawat Inap
                  </div>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                    <li>Input <strong>No RM 6 Digit</strong> & Nama Pasien</li>
                    <li>Pilih Ruangan, Dokter DPJP, & Cara Keluar</li>
                    <li>Memantau status apakah sudah divalidasi TPP & Billing</li>
                  </ul>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200/60 space-y-1.5">
                  <div className="font-bold text-sky-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-bold">
                      2
                    </span>
                    TPP dan Informasi
                  </div>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                    <li>Menerima data pasien dari ruangan</li>
                    <li>Input <strong>Pembiayaan</strong> (BPJS/Umum/Asuransi)</li>
                    <li>Input <strong>Hak Kelas</strong> (Kelas 1-3, VIP, VVIP)</li>
                    <li>Input <strong>Naik Kelas</strong> (Ya/Tidak) & <strong>Titip Kelas</strong> (Ya/Tidak)</li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/60 space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] flex items-center justify-center font-bold">
                      3
                    </span>
                    Kasir & Billing
                  </div>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                    <li>Menerima data yang sudah divalidasi TPP</li>
                    <li>Verifikasi rincian biaya / kelengkapan berkas klaim</li>
                    <li>Klik <strong>Finalisasi Pemulangan</strong> (Status langsung terhubung kembali ke ruangan)</li>
                  </ul>
                </div>

              </div>
            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <p>Sistem Pemulangan Pasien Terintegrasi (Ruangan • TPP & Informasi • Billing) • Rumah Sakit</p>
      </footer>

      {/* 1. Modal Input Pasien Ruangan */}
      {isInputRuanganOpen && (
        <RuanganInputModal
          ruanganAwal={selectedRuangan !== 'all' ? selectedRuangan : undefined}
          ruanganList={masterSettings.daftarRuangan}
          dpjpList={masterSettings.daftarDpjp}
          caraKeluarList={masterSettings.daftarCaraKeluar}
          onClose={() => setIsInputRuanganOpen(false)}
          onSubmit={handleAddPatientFromRuangan}
        />
      )}

      {/* 2. Modal Validasi TPP & Informasi */}
      {selectedTppPatient && (
        <TppValidationModal
          patient={selectedTppPatient}
          pembiayaanList={masterSettings.daftarPembiayaan}
          hakKelasList={masterSettings.daftarHakKelas}
          onClose={() => setSelectedTppPatient(null)}
          onValidate={handleValidateTpp}
        />
      )}

      {/* 3. Modal Finalisasi Billing */}
      {selectedBillingPatient && (
        <BillingFinalizeModal
          patient={selectedBillingPatient}
          onClose={() => setSelectedBillingPatient(null)}
          onFinalize={handleFinalizeBilling}
        />
      )}

      {/* 4. Modal Pelacakan Detail & Cetak Lembar Pemulangan */}
      {selectedDetailPatient && (
        <DischargeTrackingDetailModal
          patient={selectedDetailPatient}
          onClose={() => setSelectedDetailPatient(null)}
        />
      )}

    </div>
  );
}
