import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// @ts-ignore
const supabase = window.supabase;

interface Notification {
    id: number;
    message: string;
    icon: string;
    is_read: boolean;
}

const DashboardHeader = () => {
  const [userName, setUserName] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationSound = useRef(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-clear-interface-beep-2521.mp3'));


  useEffect(() => {
    const fetchUserAndNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserName(user.user_metadata.full_name || user.email);
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false);
            setUnreadCount(count || 0);
        }
    };
    fetchUserAndNotifications();
    
    const timer = setInterval(() => setLastUpdated(new Date()), 1000);

    const handleClickOutside = (event: MouseEvent) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const channel = supabase.channel('header-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' },
        (_payload: any) => {
          setUnreadCount(prev => prev + 1);
          notificationSound.current.play().catch(e => console.error("Erreur lors de la lecture du son :", e));
        }
      ).subscribe();

    return () => {
        clearInterval(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchNotifications = async () => {
    const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
    setNotifications(data || []);
  };

  const handleNotificationClick = async () => {
    if (!isNotificationsOpen) {
        fetchNotifications();
        // Mark as read and reset count
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false);
        
        if (!error) {
            setUnreadCount(0);
        }
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/compte');
  };

  const formattedDate = lastUpdated.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const formattedTime = lastUpdated.toLocaleTimeString('fr-FR');

  return (
    <header className="bg-[#121926] text-white h-[73px] flex-shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-[#1b263b]">
      <div>
        <h1 className="text-[23px] font-bold">TABLEAU DE BORD</h1>
      </div>
      <div className="hidden md:block text-center font-bold text-sm uppercase font-roboto">
        <span>DERNIÈRE MISE À JOUR: {formattedDate} {formattedTime}</span>
        <span className="mx-2">|</span>
        <span>{userName}</span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://tawk.to/chat/69127d18bb14421953fd3b14/1j9o3haf7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1 text-sm font-bold bg-[#FF570A] text-white rounded hover:bg-opacity-80 transition-colors"
        >
          <i className="fas fa-question-circle"></i>
          Aide
        </a>
        <button data-tour-id="refresh-button" className="border-2 border-white px-3 py-1 text-sm font-bold hover:bg-white hover:text-[#121926] transition-colors">
          Actualiser
        </button>
        <div data-tour-id="notifications-bell" className="relative" ref={notificationRef}>
            <i className="fas fa-bell text-xl cursor-pointer" onClick={handleNotificationClick}></i>
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[#FF570A] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
            )}
            {isNotificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#1E2A38] border border-[#1b263b] rounded-lg shadow-lg z-50">
                    <div className="p-3 font-bold border-b border-[#1b263b]">Notifications récentes</div>
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div key={notif.id} className="p-3 border-b border-[#1b263b] flex items-start gap-3">
                                <span className="text-lg pt-1">{notif.icon}</span>
                                <p className="text-sm">{notif.message}</p>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-sm text-gray-400">Aucune nouvelle notification.</p>
                    )}
                    <Link to="/dashboard/notifications" onClick={() => setIsNotificationsOpen(false)} className="block text-center p-3 bg-[#121926] hover:bg-[#FF570A] rounded-b-lg font-semibold transition-colors">
                        Voir toutes les notifications
                    </Link>
                </div>
            )}
        </div>
        <button onClick={handleSignOut} title="Se déconnecter" className="lg:hidden hover:text-[#FF570A] transition-colors">
            <i className="fas fa-sign-out-alt text-xl"></i>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;