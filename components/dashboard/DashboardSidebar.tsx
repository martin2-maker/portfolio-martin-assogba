import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// @ts-ignore
const supabase = window.supabase;

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isCollapsed, onToggle }) => {
  const [user, setUser] = useState<{ name: string; email: string; avatar_url: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = (sessionUser: any) => {
      if (sessionUser) {
        setUser({
          name: sessionUser.user_metadata.full_name || 'Utilisateur',
          email: sessionUser.email || '',
          avatar_url: sessionUser.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${sessionUser.email}&background=FF570A&color=fff`
        });
      }
    };

    const initialFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      fetchUser(user);
    };
    initialFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      fetchUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/compte');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fa-tachometer-alt', tourId: 'link-dashboard' },
    { name: 'Tâches', path: '/dashboard/tasks', icon: 'fa-tasks', tourId: 'link-tasks' },
    { name: 'Notes', path: '/dashboard/notes', icon: 'fa-sticky-note', tourId: 'link-notes' },
    { name: 'Projets', path: '/dashboard/projects', icon: 'fa-project-diagram' },
    { name: 'Gestion des Tags', path: '/dashboard/tags', icon: 'fa-tags' },
    { name: 'Extracteur e-mail', path: '/dashboard/email-extractor', icon: 'fa-at', tourId: 'link-tools' },
    { name: 'Analyse de Rentabilité', path: '/dashboard/profitability-analysis', icon: 'fa-chart-line' },
    { name: 'Compteur de mots', path: '/dashboard/word-counter', icon: 'fa-file-word' },
    { name: 'Calculatrice', path: '/dashboard/calculator', icon: 'fa-calculator' },
    { name: 'Notifications', path: '/dashboard/notifications', icon: 'fa-bell' },
    { name: 'Mon Profil', path: '/dashboard/profile', icon: 'fa-user' },
  ];

  const activeLinkStyle = {
    backgroundColor: '#FF570A',
    color: 'white',
  };

  return (
    <aside className={`bg-[#121926] text-white flex flex-col flex-shrink-0 border-r border-[#1b263b] transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div data-tour-id="profile-section" className={`p-4 bg-[#1E2A38] border-b border-[#1b263b] text-center transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'py-4' : 'py-4'}`}>
        <img
          src={user?.avatar_url}
          alt="User Avatar"
          className={`object-cover rounded-full mx-auto transition-all duration-300 ${isCollapsed ? 'w-12 h-12 mb-0' : 'w-20 h-20 mb-3'}`}
        />
        {!isCollapsed && (
          <div>
            <h3 className="font-bold text-lg whitespace-nowrap">{user?.name}</h3>
            <p className="text-sm text-gray-400 whitespace-nowrap">{user?.email}</p>
          </div>
        )}
      </div>

      <nav className="flex-grow pt-5 overflow-y-auto" data-tour-id="sidebar-nav">
        <ul>
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                className={`flex items-center gap-4 py-3 text-gray-300 hover:bg-[#1E2A38] hover:text-white transition-colors ${isCollapsed ? 'px-6 justify-center' : 'px-6'}`}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                title={item.name}
                data-tour-id={item.tourId}
              >
                <i className={`fas ${item.icon} w-5 text-center text-lg`}></i>
                {!isCollapsed && <span className="font-semibold whitespace-nowrap">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 border-t border-[#1b263b] space-y-1 flex-shrink-0">
        <button
          data-tour-id="sidebar-toggle"
          onClick={onToggle}
          className={`w-full flex items-center gap-4 py-2 text-gray-400 hover:bg-[#1E2A38] hover:text-white rounded transition-colors ${isCollapsed ? 'px-6 justify-center' : 'px-6'}`}
          title={isCollapsed ? "Agrandir" : "Réduire"}
        >
          <i className={`fas w-5 text-center text-lg ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          {!isCollapsed && <span className="font-semibold whitespace-nowrap">{ isCollapsed ? 'Agrandir' : 'Réduire' }</span>}
        </button>
        <button
          data-tour-id="logout-button"
          onClick={handleSignOut}
          className={`w-full flex items-center gap-4 py-3 text-gray-300 hover:bg-red-800/50 hover:text-white rounded transition-colors ${isCollapsed ? 'px-6 justify-center' : 'px-6'}`}
          title="Se déconnecter"
        >
          <i className="fas fa-sign-out-alt w-5 text-center text-lg"></i>
          {!isCollapsed && <span className="font-semibold whitespace-nowrap">Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;