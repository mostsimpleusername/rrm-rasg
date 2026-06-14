import { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Members } from './pages/Members';
import { Profile } from './pages/Profile';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { currentUser, isLoading } = useData();
  const [currentPage, setCurrentPage] = useState('dashboard');

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
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;