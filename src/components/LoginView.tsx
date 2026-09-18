import React, { useState } from 'react';
import { 
  Building2, CreditCard, Receipt, Shield, 
  KeyRound, LogIn, CheckCircle2, AlertCircle, Sparkles,
  Lock
} from 'lucide-react';
import { RoleType, AuthUser, RuanganItem, DAFTAR_RUANGAN, DEFAULT_USER_ACCOUNTS } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  ruanganList?: RuanganItem[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  ruanganList,
}) => {
  const availableRuangan = ruanganList 
    ? ruanganList.filter(r => r.aktif).map(r => r.nama) 
    : DAFTAR_RUANGAN;

  const [selectedRole, setSelectedRole] = useState<RoleType>('ruangan');
  const [selectedRuangan, setSelectedRuangan] = useState<string>(availableRuangan[0] || 'Ruang Melati (Lantai 2)');
  const [namaPetugas, setNamaPetugas] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    // Temukan akun
    const account = DEFAULT_USER_ACCOUNTS.find(a => a.role === selectedRole);
    const expectedPin = account ? account.pin : '1234';

    if (pinInput.trim() !== expectedPin) {
      setErrorMsg(`PIN tidak tepat. Gunakan PIN default: ${expectedPin}`);
      return;
    }

    const defaultNama = 
      selectedRole === 'ruangan' ? (namaPetugas.trim() || `Perawat ${selectedRuangan.split(' ')[1] || 'Ruangan'}`)
      : selectedRole === 'tpp' ? (namaPetugas.trim() || 'Petugas TPP & Admisi')
      : selectedRole === 'billing' ? (namaPetugas.trim() || 'Petugas Billing')
      : (namaPetugas.trim() || 'Administrator RS');

    const authUser: AuthUser = {
      id: `usr_${Date.now()}`,
      username: account?.username || selectedRole,
      namaLengkap: defaultNama,
      role: selectedRole,
      ruangan: selectedRole === 'ruangan' ? selectedRuangan : undefined,
      waktuLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    onLoginSuccess(authUser);
  };

  // Quick Direct Login helper
  const handleQuickLogin = (role: RoleType) => {
    setSelectedRole(role);
    const account = DEFAULT_USER_ACCOUNTS.find(a => a.role === role);
    const defaultNama = 
      role === 'ruangan' ? `Petugas ${selectedRuangan.split(' ')[1] || 'Ruangan'}`
      : role === 'tpp' ? 'Petugas TPP & Admisi'
      : role === 'billing' ? 'Petugas Billing'
      : 'Administrator RS';

    const authUser: AuthUser = {
      id: `usr_${Date.now()}`,
      username: account?.username || role,
      namaLengkap: defaultNama,
      role: role,
      ruangan: role === 'ruangan' ? selectedRuangan : undefined,
      waktuLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    onLoginSuccess(authUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-800 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 mb-3">
            <Building2 className="w-6 h-6 text-teal-200" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Sistem Informasi Pemulangan Pasien
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-md mx-auto">
            Pelacakan alur kepulangan terintegrasi: Ruang Rawat Inap &bull; TPP & Informasi &bull; Billing
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. Pilih Unit / Peran Kerja Anda:
            </label>
            
            {/* Grid 4 Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Ruangan */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ruangan');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedRole === 'ruangan'
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === 'ruangan' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  {selectedRole === 'ruangan' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Ruang Rawat Inap</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Input pemulangan & kirim ke TPP</div>
                </div>
              </button>

              {/* TPP & Informasi */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('tpp');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedRole === 'tpp'
                    ? 'border-sky-600 bg-sky-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === 'tpp' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  {selectedRole === 'tpp' && (
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
                  setSelectedRole('billing');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  selectedRole === 'billing'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${selectedRole === 'billing' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Receipt className="w-4 h-4" />
                  </div>
                  {selectedRole === 'billing' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Billing</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Verifikasi rincian & kuitansi</div>
                </div>
              </button>

            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            
            {/* Khusus Ruangan: Pilihan Nama Ruangan */}
            {selectedRole === 'ruangan' && (
              <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-1.5">
                <label className="block text-xs font-bold text-teal-950">
                  Pilih Ruang Rawat Inap Tugas:
                </label>
                <select
                  value={selectedRuangan}
                  onChange={(e) => setSelectedRuangan(e.target.value)}
                  className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  {availableRuangan.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-teal-800/80">
                  Form input pasien akan otomatis diarahkan ke ruangan yang dipilih ini.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Nama Petugas / Perawat (Opsional) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Petugas (Opsional):
                </label>
                <input
                  type="text"
                  value={namaPetugas}
                  onChange={(e) => setNamaPetugas(e.target.value)}
                  placeholder={
                    selectedRole === 'ruangan' ? 'e.g. Ns. Sarah' :
                    selectedRole === 'tpp' ? 'e.g. Budi (TPP)' :
                    selectedRole === 'billing' ? 'e.g. Fitri (Billing)' : 'Admin'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* PIN / Kata Sandi */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  PIN Masuk (Default: <code className="text-teal-700 font-bold">1234</code>):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Sebagai {
                  selectedRole === 'ruangan' ? 'Ruangan' :
                  selectedRole === 'tpp' ? 'TPP & Informasi' :
                  selectedRole === 'billing' ? 'Billing' : 'Admin'
                }</span>
              </button>

              {/* Admin switch link */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="text-xs text-slate-500 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Masuk Administrator</span>
              </button>
            </div>

          </form>

          {/* Fitur & Hak Akses Notice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ketentuan Hak Akses & Monitoring:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li>
                <strong>Monitoring Dashboard:</strong> Tetap muncul dan bisa dipantau secara langsung oleh seluruh peran (Ruangan, TPP, Billing, dan Admin).
              </li>
              <li>
                <strong>Tombol Tindakan:</strong> Disesuaikan otomatis. Ruangan hanya menginput kepulangan, TPP memvalidasi penjamin & kelas, dan Billing memfinalisasi kuitansi pelunasan.
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
