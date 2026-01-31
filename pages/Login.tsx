import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, UserPlus } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useData();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegistering) {
      if (!name || !email) {
        setError("Harap isi semua kolom");
        return;
      }
      register(name, email);
      setSuccess("Pendaftaran berhasil! Harap tunggu persetujuan admin.");
      setIsRegistering(false);
      setName('');
      setEmail('');
    } else {
      if (!email) {
        setError("Harap masukkan email Anda");
        return;
      }
      const success = login(email);
      if (!success) {
        setError("Email tidak valid atau akun belum aktif/disetujui.");
      }
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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>{isRegistering ? 'Daftar' : 'Masuk'}</span>
            {isRegistering ? <UserPlus size={18} /> : <ArrowRight size={18} />}
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
              }}
              className="ml-1 text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
            >
              {isRegistering ? 'Masuk' : 'Buat akun'}
            </button>
          </p>
        </div>

        {!isRegistering && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 mb-2">Akun Demo:</p>
             <div className="flex flex-wrap gap-2 justify-center">
               <button onClick={() => login('admin@org.com')} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded">Admin</button>
               <button onClick={() => login('wit@org.com')} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded">Admin SDM</button>
               <button onClick={() => login('fufu@org.com')} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded">Anggota</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};