import React from 'react';
import { useData } from '../context/DataContext';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  LogOut, 
  Menu,
  UserCircle,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const { currentUser, logout } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  if (!currentUser) return <>{children}</>;

  const isAdmin = currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.DIVISION_ADMIN;

  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activePage === page 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col items-center justify-center px-4 py-6 border-b border-slate-100 text-center">
          <img 
            src="https://rumahamal.org/_nuxt/img/00b3ba3.png" 
            alt="Rumah Amal Salman" 
            className="h-16 w-auto mb-3 object-contain"
          />
          <span className="bg-[#F7941D] text-white text-[10px] font-bold px-4 py-0.5 rounded-full tracking-widest">GARUT</span>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem page="dashboard" icon={LayoutDashboard} label="Beranda" />
          <NavItem page="events" icon={CalendarDays} label="Kegiatan" />
          <NavItem page="profile" icon={User} label="Profil" />
          {isAdmin && (
            <NavItem page="members" icon={Users} label="Anggota" />
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <span className="font-bold text-slate-900">Rumah Amal Salman</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};