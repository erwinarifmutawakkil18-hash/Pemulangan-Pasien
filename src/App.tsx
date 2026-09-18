import React, { useState, useEffect } from 'react';
import { 
  PatientDischarge, RoleType, DUMMY_PATIENTS, 
  TppValidationData, BillingFinalizationData,
  MasterSettings, DEFAULT_MASTER_SETTINGS, AuthUser
} from './types';
import { RoleNavbar } from './components/RoleNavbar';
import { PatientDischargeTable } from './components/PatientDischargeTable';
import { RuanganInputModal } from './components/RuanganInputModal';
import { TppValidationModal } from './components/TppValidationModal';
import { BillingFinalizeModal } from './components/BillingFinalizeModal';
import { DischargeTrackingDetailModal } from './components/DischargeTrackingDetailModal';
import { AdminSettingsView } from './components/AdminSettingsView';
import { LoginView } from './components/LoginView';
import { 
  Building2, CreditCard, Receipt, CheckCircle2, 
  Clock, ShieldCheck 
} from 'lucide-react';

const STORAGE_KEY = 'sim_pemulangan_pasien_3level_v2';
const SETTINGS_STORAGE_KEY = 'sim_master_settings_v1';
const AUTH_USER_KEY = 'sim_current_user_session_v1';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Gagal membaca sesi user dari localStorage:', e);
    }
    return null;
  });

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

  const [activeRole, setActiveRole] = useState<RoleType | 'monitor'>(() => {
    return currentUser ? (currentUser.role === 'admin' ? 'admin' : currentUser.role) : 'ruangan';
  });
  const [selectedRuangan, setSelectedRuangan] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default ke tanggal hari ini (YYYY-MM-DD)
    return new Date().toISOString().slice(0, 10);
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu_tpp' | 'menunggu_billing' | 'selesai'>('all');

  // Modals state
  const [isInputRuanganOpen, setIsInputRuanganOpen] = useState(false);
  const [selectedTppPatient, setSelectedTppPatient] = useState<PatientDischarge | null>(null);
  const [selectedBillingPatient, setSelectedBillingPatient] = useState<PatientDischarge | null>(null);
  const [selectedDetailPatient, setSelectedDetailPatient] = useState<PatientDischarge | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (e) {
      console.error('Gagal menyimpan sesi auth:', e);
    }
  }, [currentUser]);

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

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveRole(user.role === 'admin' ? 'admin' : user.role);
    showToast(`Selamat datang, ${user.namaLengkap} (${user.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari sesi.');
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

  // Filter pasien berdasarkan role, ruangan, status alur, tanggal pulang, dan pencarian No RM / Nama
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

      // Tanggal filter match (berdasarkan tanggal input ruangan YYYY-MM-DD)
      const patientDate = patient.waktuInputRuangan.slice(0, 10);
      const matchesDate = !selectedDate || patientDate === selectedDate;

      return matchesSearch && matchesRuangan && matchesStatus && matchesDate;
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

  // KPI Counts (sesuai tanggal terpilih jika ada)
  const patientsOnDate = selectedDate
    ? patients.filter((p) => p.waktuInputRuangan.slice(0, 10) === selectedDate)
    : patients;

  const countMenungguTpp = patientsOnDate.filter((p) => p.statusAlur === 'menunggu_tpp').length;
  const countMenungguBilling = patientsOnDate.filter((p) => p.statusAlur === 'menunggu_billing').length;
  const countSelesai = patientsOnDate.filter((p) => p.statusAlur === 'selesai').length;
  const countPasienTanggal = patientsOnDate.length;
  const totalPasien = patients.length;

  // Jika belum login, tampilkan halaman Login View
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        ruanganList={masterSettings.daftarRuangan}
      />
    );
  }

  const effectiveRole = currentUser.role === 'admin' ? activeRole : currentUser.role;

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
          currentUser={currentUser}
          onLogout={handleLogout}
          activeRole={effectiveRole}
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
          countPasienTanggal={countPasienTanggal}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          ruanganList={masterSettings.daftarRuangan}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Master & Hak Akses Administrator View */}
        {effectiveRole === 'admin' ? (
          <AdminSettingsView
            settings={masterSettings}
            onSaveSettings={(newSettings) => {
              setMasterSettings(newSettings);
              showToast('Pengaturan master dropdown dan hak akses berhasil diperbarui.');
            }}
            onCloseAdmin={() => setActiveRole('ruangan')}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
          />
        ) : (
          <>
            {/* Header Ringkas Info Data Pasien */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">Daftar Pasien Pulang</span>
                <span>&bull;</span>
                <span>
                  {selectedDate ? (
                    <>
                      Tanggal: <strong className="text-slate-700">{selectedDate}</strong> ({filteredPatients.length} pasien)
                    </>
                  ) : (
                    <>{filteredPatients.length} dari total {totalPasien} pasien</>
                  )}
                </span>
              </div>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="text-teal-700 hover:text-teal-800 hover:underline font-medium"
                >
                  Tampilkan Semua Tanggal
                </button>
              )}
            </div>

            {/* Main Patient Table with Integrated Status */}
            <PatientDischargeTable
              patients={filteredPatients}
              activeRole={effectiveRole}
              onSelectPatientDetail={(p) => setSelectedDetailPatient(p)}
              onOpenTppModal={(p) => setSelectedTppPatient(p)}
              onOpenBillingModal={(p) => setSelectedBillingPatient(p)}
            />
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
          ruanganAwal={currentUser.ruangan || (selectedRuangan !== 'all' ? selectedRuangan : undefined)}
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
