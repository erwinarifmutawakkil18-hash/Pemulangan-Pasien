import React, { useState } from 'react';
import { 
  Building2, CreditCard, Receipt, Shield, 
  KeyRound, LogIn, CheckCircle2, AlertCircle, Sparkles,
  Layers, UserCheck
} from 'lucide-react';
import { 
  RoleType, AuthUser, RuanganItem, 
  DEFAULT_USER_ACCOUNTS, BangsalId, DAFTAR_BANGSAL,
  UserAccountCredential
} from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  ruanganList?: RuanganItem[];
  userAccounts?: UserAccountCredential[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  ruanganList,
  userAccounts,
}) => {
  const allRooms = ruanganList || [];
  const accounts = userAccounts && userAccounts.length > 0 ? userAccounts : DEFAULT_USER_ACCOUNTS;

  // Pilihan Role Utama: 'bangsal' (R. Rawat Inap), 'tpp', 'billing', 'admin'
  const [loginCategory, setLoginCategory] = useState<'bangsal' | 'tpp' | 'billing' | 'admin'>('bangsal');
  
  // Jika loginCategory === 'bangsal', akun R. yang dipilih
  const [selectedBangsalId, setSelectedBangsalId] = useState<BangsalId>('general');

  const [pinInput, setPinInput] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Temukan akun target saat ini
  const targetAccount = accounts.find(a => {
    if (loginCategory === 'bangsal') {
      return a.role === 'ruangan' && a.bangsalId === selectedBangsalId;
    }
    return a.role === loginCategory;
  });

  const expectedPin = targetAccount ? targetAccount.pin : '1234';

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (pinInput.trim() !== expectedPin) {
      setErrorMsg(
        expectedPin === '1234'
          ? 'PIN tidak tepat. Gunakan PIN default: 1234'
          : 'PIN tidak tepat. Silakan masukkan PIN baru yang telah Anda ubah atau hubungi Admin jika lupa PIN.'
      );
      return;
    }

    const bangsalMeta = DAFTAR_BANGSAL.find(b => b.id === selectedBangsalId);
    const effectiveRole: RoleType = loginCategory === 'bangsal' ? 'ruangan' : loginCategory;
    
    const accountNama = 
      loginCategory === 'bangsal' 
        ? `R. ${bangsalMeta?.nama || 'Rawat Inap'}`
        : loginCategory === 'tpp' 
          ? 'TPP & Informasi'
          : loginCategory === 'billing' 
            ? 'Billing & Kasir'
            : 'Administrator RS';

    const authUser: AuthUser = {
      id: `usr_${Date.now()}`,
      username: targetAccount?.username || (loginCategory === 'bangsal' ? `r_${selectedBangsalId}` : loginCategory),
      namaLengkap: accountNama,
      role: effectiveRole,
      bangsalId: loginCategory === 'bangsal' ? selectedBangsalId : undefined,
      waktuLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    onLoginSuccess(authUser);
  };

  // Login Cepat untuk Non-Bangsal (TPP, Billing, Admin)
  const handleQuickLoginNonBangsal = (role: 'tpp' | 'billing' | 'admin') => {
    setLoginCategory(role);
    const acc = accounts.find(a => a.role === role);
    const defaultNama = 
      role === 'tpp' ? 'TPP & Informasi'
      : role === 'billing' ? 'Billing & Kasir'
      : 'Administrator RS';

    const authUser: AuthUser = {
      id: `usr_${Date.now()}`,
      username: acc?.username || role,
      namaLengkap: defaultNama,
      role: role,
      waktuLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    onLoginSuccess(authUser);
  };

  // Ambil data akun bangsal yang sedang dipilih
  const currentBangsalAccount = accounts.find(
    a => a.role === 'ruangan' && a.bangsalId === selectedBangsalId
  );
  const roomsInSelectedBangsal = allRooms.filter(r => r.aktif && r.bangsalId === selectedBangsalId);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-3 sm:p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-800 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 mb-3 shadow-inner">
            <Building2 className="w-6 h-6 text-teal-200" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Sistem Informasi Pemulangan Pasien
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-lg mx-auto">
            Pelacakan alur kepulangan terintegrasi: Akun R. Rawat Inap &bull; TPP & Informasi &bull; Billing
          </p>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-8 space-y-6">
          
          {/* 1. Pilih Kategori Login Unit Utama */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. Pilih Akses:
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Ruang Rawat Inap (R.) */}
              <button
                type="button"
                onClick={() => {
                  setLoginCategory('bangsal');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  loginCategory === 'bangsal'
                    ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${loginCategory === 'bangsal' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  {loginCategory === 'bangsal' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">R. Rawat Inap</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">7 Pilihan R. Rawat Inap</div>
                </div>
              </button>

              {/* TPP & Informasi */}
              <button
                type="button"
                onClick={() => {
                  setLoginCategory('tpp');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  loginCategory === 'tpp'
                    ? 'border-sky-600 bg-sky-50/80 shadow-xs ring-1 ring-sky-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${loginCategory === 'tpp' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  {loginCategory === 'tpp' && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">TPP & Informasi</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Validasi jaminan & hak kelas</div>
                </div>
              </button>

              {/* Billing */}
              <button
                type="button"
                onClick={() => {
                  setLoginCategory('billing');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  loginCategory === 'billing'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${loginCategory === 'billing' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Receipt className="w-4 h-4" />
                  </div>
                  {loginCategory === 'billing' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Billing & Kasir</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Verifikasi rincian & kuitansi</div>
                </div>
              </button>

            </div>
          </div>

          {/* KHUSUS RAWAT INAP: PILIH AKUN R. (TIDAK PERLU PILIH KAMAR) */}
          {loginCategory === 'bangsal' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-teal-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>2. Pilih Ruangan:</span>
                </label>
                <span className="text-[11px] text-teal-700 font-semibold bg-teal-100/70 px-2 py-0.5 rounded-md">
                  7 Pilihan R. Rawat Inap
                </span>
              </div>

              {/* Grid 7 Akun R. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DAFTAR_BANGSAL.map((bangsal) => {
                  const isSelected = selectedBangsalId === bangsal.id;
                  const roomCount = allRooms.filter(r => r.aktif && r.bangsalId === bangsal.id).length;
                  const acc = accounts.find(a => a.bangsalId === bangsal.id);

                  return (
                    <button
                      key={bangsal.id}
                      type="button"
                      onClick={() => {
                        setSelectedBangsalId(bangsal.id);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        isSelected 
                          ? 'border-teal-600 bg-teal-700 text-white shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-teal-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div>
                          <div className="font-bold text-xs">
                            R. {bangsal.nama}
                          </div>
                          <div className={`text-[10px] font-mono ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                            User: {acc?.username || `r_${bangsal.id}`}
                          </div>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-200 shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0 mt-1" />
                        )}
                      </div>

                      <div className={`text-[10px] line-clamp-1 mt-1 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {bangsal.keterangan || `${roomCount} Kamar Terhubung`}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info R. Aktif & Fleksibilitas Kamar */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Akun Aktif: <strong>R. {DAFTAR_BANGSAL.find(b => b.id === selectedBangsalId)?.nama}</strong>
                    <span className="text-slate-400 ml-1.5 font-normal">
                      ({roomsInSelectedBangsal.length} kamar terhubung)
                    </span>
                  </span>
                </div>
                <span className="text-[11px] text-teal-700 font-medium hidden sm:inline">
                  *Kamar dipilih saat input pasien pulang
                </span>
              </div>
            </div>
          )}

          {/* Form PIN Masuk (Nama Petugas Dihilangkan) */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                PIN Masuk (Default: <code className="text-teal-700 font-bold">1234</code>):
              </label>
              <div className="relative max-w-sm">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Tombol Masuk */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sebagai {
                  loginCategory === 'bangsal' 
                    ? `R. ${DAFTAR_BANGSAL.find(b => b.id === selectedBangsalId)?.nama}` 
                    : loginCategory === 'tpp' ? 'TPP & Informasi' 
                    : loginCategory === 'billing' ? 'Billing & Kasir' : 'Admin'
                }</span>
              </button>

              {/* Shortcut Masuk Administrator */}
              <button
                type="button"
                onClick={() => handleQuickLoginNonBangsal('admin')}
                className="text-xs text-slate-500 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Masuk Administrator</span>
              </button>
            </div>

          </form>

          {/* Keterangan Hak Akses */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sistem Monitoring Berbasis R. (Ruang Rawat Inap):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Setiap R. akan langsung fokus memonitor alur pasien di ruangannya sendiri (pasien pulang, validasi TPP, antre billing, hingga selesai). Tersedia juga menu cepat 1 klik untuk melihat pemantauan proses secara keseluruhan dari ruang lain di RS.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

