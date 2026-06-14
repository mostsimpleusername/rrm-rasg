import { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Layout } from './components/Layout';
import { ToastProvider, useToast } from './context/ToastContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Members } from './pages/Members';
import { Profile } from './pages/Profile';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { currentUser, isLoading } = useData();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { showToast } = useToast();

  useEffect(() => {
    // Check for Supabase email confirmation redirect hash
    const hash = window.location.hash;
    if (hash && hash.includes('type=signup')) {
      showToast('Email berhasil diverifikasi! Menunggu persetujuan admin.', 'success');
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } else if (hash && hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.substring(1));
      const errMsg = params.get('error_description');
      if (errMsg) {
        showToast(decodeURIComponent(errMsg.replace(/\+/g, ' ')), 'error');
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [showToast]);

  useEffect(() => {
    if (!currentUser) {
      setCurrentPage('dashboard');
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'events': return <Events />;
      case 'members': return <Members />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activePage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ToastProvider>
  );
}

export default App;