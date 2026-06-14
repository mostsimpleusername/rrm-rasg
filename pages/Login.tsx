import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, UserPlus, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useData();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        if (!name || !email || !password) {
          setError("Harap isi semua kolom");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError("Kata sandi minimal 6 karakter");
          setIsSubmitting(false);
          return;
        }
        await register(name, email, password);
        setSuccess("Pendaftaran berhasil! Harap tunggu persetujuan admin.");
        setIsRegistering(false);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        if (!email || !password) {
          setError("Harap masukkan email dan kata sandi Anda");
          setIsSubmitting(false);
          return;
        }
        const loginSuccess = await login(email, password);
        if (!loginSuccess) {
          setError("Email/kata sandi tidak valid atau akun belum aktif/disetujui.");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <img 
            src="https://rumahamal.org/_nuxt/img/00b3ba3.png" 
            alt="Rumah Amal Salman"
            className="h-24 w-auto mb-4 object-contain"
          />
          <div className="bg-[#F7941D] text-white px-8 py-1.5 rounded-full font-bold text-sm tracking-widest shadow-sm mb-6">
            GARUT
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRegistering ? 'Buat Akun' : 'Selamat Datang'}
          </h1>
          <p className="text-slate-500 mt-2">
            {isRegistering 
              ? 'Bergabunglah dengan organisasi untuk memulai' 
              : 'Masuk untuk mengakses dasbor Anda'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Masukkan email Anda"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder={isRegistering ? "Minimal 6 karakter" : "Masukkan kata sandi Anda"}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{isRegistering ? 'Daftar' : 'Masuk'}</span>
                {isRegistering ? <UserPlus size={18} /> : <ArrowRight size={18} />}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? "Sudah punya akun?" : "Belum punya akun?"}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
                setPassword('');
              }}
              className="ml-1 text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
              disabled={isSubmitting}
            >
              {isRegistering ? 'Masuk' : 'Buat akun'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};