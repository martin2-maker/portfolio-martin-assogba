import React, { useState, useEffect, useCallback } from 'react';

// @ts-ignore
const supabase = window.supabase;

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121926] rounded-lg shadow-xl w-full max-w-md border border-[#1b263b] font-sans-fallback">
                <div className="p-4 border-b border-[#1b263b]">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
                <div className="p-6">
                    <p className="text-white">{message}</p>
                </div>
                <div className="p-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors">Annuler</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors">Confirmer</button>
                </div>
            </div>
        </div>
    );
};

interface Notification {
    id: number;
    created_at: string;
    message: string;
    is_read: boolean;
    icon: string;
    color: string;
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(30);

        if (error) {
            console.error("Error fetching notifications:", error);
        } else {
            setNotifications(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchNotifications();

        const channel = supabase.channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: { new: Notification }) => {
                setNotifications(currentNotifications => [payload.new, ...currentNotifications]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: number) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const handleClearAll = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        await supabase.from('notifications').delete().eq('user_id', user.id);
        setNotifications([]);
        setIsModalOpen(false);
    };

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
        interval = seconds / 2592000;
        if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
        interval = seconds / 86400;
        if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
        interval = seconds / 3600;
        if (interval > 1) return `il y a ${Math.floor(interval)} heures`;
        interval = seconds / 60;
        if (interval > 1) return `il y a ${Math.floor(interval)} minutes`;
        return `il y a quelques secondes`;
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleClearAll}
                title="Vider les notifications"
                message="Voulez-vous vraiment supprimer toutes vos notifications ? Cette action est irréversible."
            />
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">Notifications</h1>
                {notifications.length > 0 && (
                     <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#121926] border border-red-500 text-white font-bold rounded hover:bg-red-500 transition-colors">
                        Vider tout
                    </button>
                )}
            </header>
            
            <div className="bg-[#121926] rounded-lg space-y-2">
                {loading ? (
                    <p className="p-8 text-center">Chargement des notifications...</p>
                ) : notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className={`relative flex items-start gap-4 p-4 bg-[#121926] border border-transparent border-l-4 transition-all duration-300 ${notif.is_read ? 'opacity-60' : 'bg-white/5'}`} style={{ borderLeftColor: notif.color }}>
                            <div className="text-xl pt-1">{notif.icon}</div>
                            <div className="flex-1">
                                <p className="text-white text-base whitespace-pre-wrap">{notif.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{timeSince(notif.created_at)}</p>
                            </div>
                            {!notif.is_read && (
                                <button onClick={() => handleMarkAsRead(notif.id)} title="Marquer comme lu" className="w-3 h-3 bg-blue-500 rounded-full hover:bg-blue-400"></button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center p-16 text-white/70">
                        <i className="fas fa-bell-slash text-5xl mb-4"></i>
                        <p>Vous n'avez aucune notification pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
