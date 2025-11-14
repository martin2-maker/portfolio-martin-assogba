import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import ToastNotification from './ToastNotification';
import DashboardTour from './DashboardTour';

// @ts-ignore
const supabase = window.supabase;

interface ToastState {
  id: number;
  message: string;
  icon: string;
  color: string;
}

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const checkUserAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!user.user_metadata.has_completed_tour) {
        setShowTour(true);
      }

      const channel = supabase.channel('realtime-notifications-toast')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload: any) => {
            const newToast = {
                id: payload.new.id,
                message: payload.new.message,
                icon: payload.new.icon,
                color: payload.new.color,
            };
            setToasts(currentToasts => [...currentToasts, newToast]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    checkUserAndSubscribe();
  }, []);

  const handleCloseToast = (id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleTourComplete = async () => {
    setShowTour(false);
    const { error } = await supabase.auth.updateUser({
      data: { has_completed_tour: true }
    });
    if (error) {
      console.error("Erreur lors de la mise à jour du profil utilisateur:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#121926] overflow-hidden">
      {showTour && <DashboardTour onComplete={handleTourComplete} />}
      <DashboardSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex flex-col flex-grow relative">
        <DashboardHeader />
        <main data-tour-id="main-content" className="flex-grow p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
        <div className="absolute top-20 right-8 z-50 space-y-3">
            {toasts.map((toast) => (
                <ToastNotification
                    key={toast.id}
                    message={toast.message}
                    icon={toast.icon}
                    color={toast.color}
                    onClose={() => handleCloseToast(toast.id)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;