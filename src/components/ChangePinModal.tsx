import React, { useState } from 'react';
import { 
  X, KeyRound, Lock, Eye, EyeOff, CheckCircle2, 
  AlertCircle, ShieldCheck, UserCheck 
} from 'lucide-react';
import { AuthUser, UserAccountCredential, DAFTAR_BANGSAL } from '../types';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  userAccounts: UserAccountCredential[];
  onSavePin: (accountId: string, newPin: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userAccounts,
  onSavePin,
  onSuccessToast,
}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  // Temukan akun yang sesuai dengan user login
  const targetAccount = userAccounts.find((a) => {
    if (currentUser.role === 'ruangan') {
      return a.role === 'ruangan' && a.bangsalId === currentUser.bangsalId;
    }
    return a.role === currentUser.role;
  });

  const accountName = targetAccount?.nama || currentUser.namaLengkap;
  const username = targetAccount?.username || currentUser.username;
  const currentAccountPin = targetAccount ? targetAccount.pin : '1234';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Verifikasi PIN Lama
    if (oldPin.trim() !== currentAccountPin) {
      setErrorMsg('PIN saat ini tidak sesuai. Masukkan PIN yang benar untuk akun ini.');
      return;
    }

    // 2. Validasi panjang PIN Baru
    if (newPin.trim().length < 4) {
      setErrorMsg('PIN baru minimal harus 4 karakter/digit.');
      return;
    }

    // 3. Cek apakah PIN baru sama dengan PIN lama
    if (newPin.trim() === oldPin.trim()) {
      setErrorMsg('PIN baru tidak boleh sama dengan PIN saat ini.');
      return;
    }

    // 4. Validasi konfirmasi PIN
    if (newPin.trim() !== confirmPin.trim()) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    if (!targetAccount) {
      setErrorMsg('Akun tidak ditemukan dalam sistem.');
      return;
    }

    // Eksekusi perubahan
    onSavePin(targetAccount.id, newPin.trim());
    onSuccessToast(`PIN akun ${accountName} berhasil diubah! Gunakan PIN baru ini untuk sesi berikutnya.`);
    
    // Reset state
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setErrorMsg(null);
    onClose();
  };

  const handleClose = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <KeyRound className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Ganti PIN / Password Akun</h3>
              <p className="text-[11px] text-teal-200/90">
                Pembaruan PIN mandiri unit ruangan / petugas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Akun yang Sedang Aktif */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Akun yang Diubah:</span>
              <strong className="text-xs text-slate-900 font-bold">{accountName}</strong>
              <span className="text-[11px] text-teal-700 font-mono ml-2">(@{username})</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
            {currentUser.role.toUpperCase()}
          </span>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Input PIN Lama */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              PIN Saat Ini (Lama):
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showOldPin ? 'text' : 'password'}
                required
                maxLength={12}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                placeholder="Masukkan PIN saat ini"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowOldPin(!showOldPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                tabIndex={-1}
              >
                {showOldPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              *PIN bawaan awal adalah 1234
            </p>
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-3">
            {/* Input PIN Baru */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                PIN Baru (Minimal 4 Karakter/Angka):
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPin ? 'text' : 'password'}
                  required
                  maxLength={12}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Contoh: 5678 atau pin baru Anda"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi PIN Baru */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ulangi Konfirmasi PIN Baru:
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPin ? 'text' : 'password'}
                  required
                  maxLength={12}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Ketik ulang PIN baru"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan PIN Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
