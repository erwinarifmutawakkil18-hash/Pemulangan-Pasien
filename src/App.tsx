import React, { useState, useEffect } from 'react';
import { 
  PatientDischarge, RoleType, DUMMY_PATIENTS, 
  TppValidationData, BillingFinalizationData,
  MasterSettings, DEFAULT_MASTER_SETTINGS, AuthUser,
  DAFTAR_BANGSAL, DEFAULT_USER_ACCOUNTS, UserAccountCredential
} from './types';
import { RoleNavbar, ScopeMode } from './components/RoleNavbar';
import { PatientDischargeTable } from './components/PatientDischargeTable';
import { RuanganInputModal } from './components/RuanganInputModal';
import { TppValidationModal } from './components/TppValidationModal';
import { BillingFinalizeModal } from './components/BillingFinalizeModal';
import { DischargeTrackingDetailModal } from './components/DischargeTrackingDetailModal';
import { AdminSettingsView } from './components/AdminSettingsView';
import { LoginView } from './components/LoginView';
import { ChangePinModal } from './components/ChangePinModal';
import { 
  Building2, CreditCard, Receipt, CheckCircle2, 
  Clock, ShieldCheck 
} from 'lucide-react';

const STORAGE_KEY = 'sim_pemulangan_pasien_3level_v4';
const SETTINGS_STORAGE_KEY = 'sim_master_settings_v4';
const AUTH_USER_KEY = 'sim_current_user_session_v2';
const USER_ACCOUNTS_KEY = 'sim_user_accounts_v3';

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
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((p: PatientDischarge) => ({
            ...p,
            caraKeluar: (p.caraKeluar as string) === 'Membaik (Rawat Jalan)' ? 'Membaik' : p.caraKeluar
          }));
        }
      }
    } catch (e) {
      console.warn('Gagal membaca data localStorage, menggunakan data default.', e);
    }
    return DUMMY_PATIENTS;
  });

  const [masterSettings, setMasterSettings] = useState<MasterSettings>(() => {
    try {
      const storedV4 = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedV4) {
        const parsed: MasterSettings = JSON.parse(storedV4);
        if (Array.isArray(parsed.daftarCaraKeluar)) {
          parsed.daftarCaraKeluar = parsed.daftarCaraKeluar.map((item) =>
            item === 'Membaik (Rawat Jalan)' ? 'Membaik' : item
          );
        }
        return parsed;
      }
      // Migrasi dari v3 jika ada: perbarui daftarDpjp ke daftar dokter riil
      const storedV3 = localStorage.getItem('sim_master_settings_v3');
      if (storedV3) {
        const parsed = JSON.parse(storedV3);
        const migrated: MasterSettings = {
          ...DEFAULT_MASTER_SETTINGS,
          ...parsed,
          daftarDpjp: DEFAULT_MASTER_SETTINGS.daftarDpjp,
          daftarCaraKeluar: (parsed.daftarCaraKeluar || DEFAULT_MASTER_SETTINGS.daftarCaraKeluar).map((item: string) =>
            item === 'Membaik (Rawat Jalan)' ? 'Membaik' : item
          )
        };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch (e) {
      console.warn('Gagal membaca master settings, memakai default.');
    }
    return DEFAULT_MASTER_SETTINGS;
  });

  const [userAccounts, setUserAccounts] = useState<UserAccountCredential[]>(() => {
    try {
      const stored = localStorage.getItem(USER_ACCOUNTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const accountMap = new Map(parsed.map((a: UserAccountCredential) => [a.id, a]));
          return DEFAULT_USER_ACCOUNTS.map(defaultAcc => {
            const existing = accountMap.get(defaultAcc.id);
            return existing ? { ...defaultAcc, ...existing } : defaultAcc;
          });
        }
      }
    } catch (e) {
      console.warn('Gagal membaca akun user dari localStorage:', e);
    }
    return DEFAULT_USER_ACCOUNTS;
  });

  const [activeRole, setActiveRole] = useState<RoleType | 'monitor'>(() => {
    return currentUser ? (currentUser.role === 'admin' ? 'admin' : currentUser.role) : 'ruangan';
  });
  const [selectedRuangan, setSelectedRuangan] = useState<string>('all');
  const [scopeMode, setScopeMode] = useState<ScopeMode>('own');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default ke tanggal hari ini (YYYY-MM-DD)
    return new Date().toISOString().slice(0, 10);
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu_tpp' | 'menunggu_billing' | 'selesai'>('all');

  // Modals state
  const [isInputRuanganOpen, setIsInputRuanganOpen] = useState(false);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
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

  // Sync userAccounts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(userAccounts));
    } catch (e) {
      console.error('Gagal menyimpan akun user ke localStorage:', e);
    }
  }, [userAccounts]);

  const handleSaveUserPin = (accountId: string, newPin: string) => {
    setUserAccounts(prev =>
      prev.map(acc => (acc.id === accountId ? { ...acc, pin: newPin } : acc))
    );

    const target = userAccounts.find(a => a.id === accountId);
    if (target?.role === 'admin') {
      setMasterSettings(prev => ({ ...prev, adminPin: newPin }));
    }

    showToast(`PIN akun ${target?.nama || ''} berhasil diperbarui.`);
  };

  const handleResetAllPins = () => {
    const resetList = DEFAULT_USER_ACCOUNTS.map(a => ({ ...a, pin: '1234' }));
    setUserAccounts(resetList);
    setMasterSettings(prev => ({ ...prev, adminPin: '1234' }));
    showToast('Semua PIN akun berhasil dikembalikan ke default: 1234');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveRole(user.role === 'admin' ? 'admin' : user.role);
    setScopeMode('own');
    showToast(`Selamat datang, ${user.namaLengkap} (${user.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScopeMode('own');
    setSelectedRuangan('all');
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

  // Tentukan daftar nama kamar yang dimiliki oleh user ruangan (berdasarkan bangsalId atau ruangan)
  const userRoomNames = React.useMemo(() => {
    if (!currentUser || currentUser.role !== 'ruangan') return [];
    if (currentUser.bangsalId) {
      return masterSettings.daftarRuangan
        .filter((r) => r.bangsalId === currentUser.bangsalId && r.aktif)
        .map((r) => r.nama);
    }
    if (currentUser.ruangan) {
      return [currentUser.ruangan];
    }
    return [];
  }, [currentUser, masterSettings.daftarRuangan]);

  // Apakah sedang dalam mode fokus R. sendiri
  const isFocusingOwnRoom = currentUser?.role === 'ruangan' && scopeMode === 'own';

  // Pasien dasar yang relevan dengan cakupan pemantauan (fokus R. sendiri vs pantau seluruh RS)
  const scopedPatients = React.useMemo(() => {
    if (isFocusingOwnRoom && userRoomNames.length > 0) {
      return patients.filter((p) => userRoomNames.includes(p.ruangan));
    }
    return patients;
  }, [patients, isFocusingOwnRoom, userRoomNames]);

  // Filter pasien berdasarkan role, ruangan, status alur, tanggal pulang, dan pencarian No RM / Nama
  const filteredPatients = scopedPatients
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

  // KPI Counts (sesuai cakupan fokus R. atau seluruh RS, dan tanggal terpilih)
  const scopedPatientsOnDate = selectedDate
    ? scopedPatients.filter((p) => p.waktuInputRuangan.slice(0, 10) === selectedDate)
    : scopedPatients;

  const countMenungguTpp = scopedPatientsOnDate.filter((p) => p.statusAlur === 'menunggu_tpp').length;
  const countMenungguBilling = scopedPatientsOnDate.filter((p) => p.statusAlur === 'menunggu_billing').length;
  const countSelesai = scopedPatientsOnDate.filter((p) => p.statusAlur === 'selesai').length;
  const countPasienTanggal = scopedPatientsOnDate.length;
  const totalPasien = scopedPatients.length;

  // Jika belum login, tampilkan halaman Login View
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        ruanganList={masterSettings.daftarRuangan}
        userAccounts={userAccounts}
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        
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
          onOpenChangePin={() => setIsChangePinOpen(true)}
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
          scopeMode={scopeMode}
          onScopeModeChange={setScopeMode}
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
            userAccounts={userAccounts}
            onSaveUserPin={handleSaveUserPin}
            onResetAllPins={handleResetAllPins}
          />
        ) : (
          <>
            {/* Header Ringkas Info Data Pasien & Indikator Cakupan Ruangan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 px-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">
                  {currentUser?.role === 'ruangan'
                    ? (scopeMode === 'own'
                        ? `Monitoring Pasien R. ${DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama || currentUser.ruangan || ''}`
                        : 'Monitoring Keseluruhan Ruangan RS')
                    : 'Daftar Pasien Pulang Seluruh Ruangan'}
                </span>
                <span>&bull;</span>
                <span>
                  {selectedDate ? (
                    <>
                      Tanggal: <strong className="text-slate-700">{selectedDate}</strong> ({filteredPatients.length} pasien)
                    </>
                  ) : (
                    <>{filteredPatients.length} pasien terfilter (dari {totalPasien} data)</>
                  )}
                </span>
                {currentUser?.role === 'ruangan' && scopeMode === 'own' && (
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Fokus R. Sendiri
                  </span>
                )}
                {currentUser?.role === 'ruangan' && scopeMode === 'all' && (
                  <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Mode Pantau Seluruh RS
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {currentUser?.role === 'ruangan' && (
                  <button
                    type="button"
                    onClick={() => setScopeMode(scopeMode === 'own' ? 'all' : 'own')}
                    className="text-teal-700 hover:text-teal-800 hover:underline font-semibold"
                  >
                    {scopeMode === 'own' ? 'Lihat Semua Ruang RS &rarr;' : '&larr; Kembali ke Fokus R. Sendiri'}
                  </button>
                )}
                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate('')}
                    className="text-slate-500 hover:text-slate-800 hover:underline font-medium"
                  >
                    Tampilkan Semua Tanggal
                  </button>
                )}
              </div>
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
          bangsalId={currentUser.bangsalId}
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

      {/* 5. Modal Ganti PIN Pengguna (Ruangan, TPP, Billing, Admin) */}
      {isChangePinOpen && currentUser && (
        <ChangePinModal
          isOpen={isChangePinOpen}
          onClose={() => setIsChangePinOpen(false)}
          currentUser={currentUser}
          userAccounts={userAccounts}
          onSavePin={handleSaveUserPin}
          onSuccessToast={showToast}
        />
      )}

    </div>
  );
}
