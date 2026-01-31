import { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Members } from './pages/Members';
import { Profile } from './pages/Profile';

const AppContent = () => {
  const { currentUser } = useData();
  const [currentPage, setCurrentPage] = useState('dashboard');

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