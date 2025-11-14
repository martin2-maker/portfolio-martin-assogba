import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

// @ts-ignore
const supabase = window.supabase;

const Toast = ({ message, isVisible, isError = false }: { message: string, isVisible: boolean, isError?: boolean }) => {
    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-5 right-5 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
            {message}
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmButtonClass = 'bg-red-600 hover:bg-red-500', confirmButtonText = 'Oui, supprimer mon compte' }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string, confirmButtonClass?: string, confirmButtonText?: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121926] rounded-lg shadow-xl w-full max-w-md border border-red-500/50">
                <div className="p-4 border-b border-red-500/30">
                    <h3 className="text-lg font-bold text-red-400">{title}</h3>
                </div>
                <div className="p-6">
                    <p className="text-white">{message}</p>
                </div>
                <div className="p-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition-colors">Annuler</button>
                    <button onClick={onConfirm} className={`px-4 py-2 text-white font-bold rounded transition-colors ${confirmButtonClass}`}>
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProfilePage = () => {
    const [user, setUser] = useState({ name: '', email: '', avatar: '' });
    const [loading, setLoading] = useState({ info: false, password: false, avatar: false, delete: false, reset: false });
    const [toast, setToast] = useState({ show: false, message: '', isError: false });
    const navigate = useNavigate();
    
    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordCriteria, setPasswordCriteria] = useState({
        hasInput: false, length: false, uppercase: false, lowercase: false, number: false, special: false
    });
    
    // Reset/Delete account state
    const [resetConfirmation, setResetConfirmation] = useState('');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const RESET_CONFIRMATION_PHRASE = 'Oui, je souhaite réinitialiser mes données';

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    name: user.user_metadata.full_name || '',
                    email: user.email || '',
                    avatar: user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=FF570A&color=fff`
                });
            } else {
                navigate('/compte');
            }
        };
        fetchUser();
    }, [navigate]);
    
    useEffect(() => {
        setPasswordCriteria({
            hasInput: newPassword.length > 0,
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[@$!%*?&]/.test(newPassword)
        });
    }, [newPassword]);

    const showToast = (message: string, isError = false) => {
        setToast({ show: true, message, isError });
        setTimeout(() => setToast({ show: false, message: '', isError }), 6000);
    };

    const handleStorageError = (error: any, context: string) => {
        console.error(`Error during ${context}:`, error);
        let message = error.message || `Erreur lors de ${context}.`;
        if (typeof message === 'string' && message.includes("Bucket not found")) {
            message = "Erreur de configuration : Le 'bucket' de stockage Supabase 'avatars' est manquant. Veuillez le créer dans votre projet Supabase.";
        }
        showToast(message, true);
    }

    const handleInfoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, info: true }));
        const { error } = await supabase.auth.updateUser({ data: { full_name: user.name } });
        if (error) {
            showToast("Erreur lors de la mise à jour du profil.", true);
        } else {
            showToast("Profil mis à jour avec succès !");
        }
        setLoading(prev => ({ ...prev, info: false }));
    };
    
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPassword });
        if (signInError) {
             showToast("Le mot de passe actuel est incorrect.", true);
             return;
        }

        const allCriteriaMet = Object.values(passwordCriteria).slice(1).every(Boolean); // Exclude hasInput
        if (!allCriteriaMet) {
            showToast("Le nouveau mot de passe ne respecte pas les critères de sécurité.", true);
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast("Les nouveaux mots de passe ne correspondent pas.", true);
            return;
        }

        setLoading(prev => ({ ...prev, password: true }));
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            showToast(error.message, true);
        } else {
            showToast("Mot de passe mis à jour avec succès !");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setLoading(prev => ({ ...prev, password: false }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setLoading(prev => ({ ...prev, avatar: true }));

        const { data: userResponse } = await supabase.auth.getUser();
        if (!userResponse.user) return;

        const fileName = `${userResponse.user.id}/${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);

        if (uploadError) {
            handleStorageError(uploadError, "téléversement de l'avatar");
            setLoading(prev => ({ ...prev, avatar: false }));
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const { error: updateUserError } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

        if (updateUserError) {
            showToast("Erreur lors de la mise à jour de l'avatar.", true);
        } else {
            setUser(prev => ({ ...prev, avatar: publicUrl }));
            showToast("Avatar mis à jour !");
        }
        setLoading(prev => ({ ...prev, avatar: false }));
    };
    
    const handleResetClick = () => {
        if (resetConfirmation !== RESET_CONFIRMATION_PHRASE) {
            showToast("La phrase de confirmation est incorrecte.", true);
            return;
        }
        setIsResetModalOpen(true);
    };
    
    const handleConfirmReset = async () => {
        setLoading(prev => ({ ...prev, reset: true }));
        setIsResetModalOpen(false);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            showToast("Utilisateur non trouvé.", true);
            setLoading(prev => ({ ...prev, reset: false }));
            return;
        }

        try {
            const tablesToReset = ['tasks', 'notes', 'projects', 'tags', 'notifications'];
            const resetPromises = tablesToReset.map(table =>
                supabase.from(table).delete().eq('user_id', user.id)
            );
            await Promise.all(resetPromises);
            
            showToast("Toutes vos données ont été réinitialisées avec succès.");
            setResetConfirmation('');
            navigate('/dashboard');

        } catch (err) {
            console.error("Data reset process failed:", err);
            showToast("Une erreur est survenue lors de la réinitialisation des données.", true);
        } finally {
            setLoading(prev => ({ ...prev, reset: false }));
        }
    };

    const handleDeleteClick = () => {
        if (!deletePassword) {
            showToast("Veuillez entrer votre mot de passe pour continuer.", true);
            return;
        }
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setLoading(prev => ({ ...prev, delete: true }));
        setIsDeleteModalOpen(false);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            showToast("Utilisateur non trouvé.", true);
            setLoading(prev => ({ ...prev, delete: false }));
            return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: deletePassword,
        });

        if (signInError) {
            showToast("Le mot de passe que vous avez saisi est incorrect.", true);
            setLoading(prev => ({ ...prev, delete: false }));
            return;
        }

        try {
            const tablesToDeleteFrom = ['tasks', 'notes', 'projects', 'tags', 'notifications'];
            const deletePromises = tablesToDeleteFrom.map(table =>
                supabase.from(table).delete().eq('user_id', user.id)
            );
            await Promise.all(deletePromises);
            
            await supabase.auth.signOut();
            navigate('/');
        } catch (err) {
            console.error("Deletion process failed:", err);
            showToast("Une erreur est survenue lors de la suppression des données.", true);
        } finally {
            setLoading(prev => ({ ...prev, delete: false }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto text-white space-y-12">
            <Toast message={toast.message} isVisible={toast.show} isError={toast.isError} />
            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleConfirmReset}
                title="Confirmer la réinitialisation"
                message="Toutes vos données (tâches, notes, projets, etc.) seront définitivement supprimées. Êtes-vous sûr de vouloir continuer ?"
                confirmButtonClass="bg-yellow-600 hover:bg-yellow-500"
                confirmButtonText="Oui, réinitialiser"
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Êtes-vous absolument certain ?"
                message="Ceci est votre dernière chance. La suppression de votre compte est définitive. Toutes vos données seront perdues."
            />
            <h1 className="text-3xl font-bold">Mon Profil</h1>

            {/* Profile Information Section */}
            <div className="bg-[#1b263b] p-8 rounded-lg border border-white/10">
                <h2 className="text-xl font-bold mb-6">Informations personnelles</h2>
                <form className="space-y-6" onSubmit={handleInfoUpdate}>
                    <div className="flex items-center gap-6">
                        <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        <div>
                            <button type="button" onClick={() => avatarInputRef.current?.click()} disabled={loading.avatar} className="cursor-pointer px-4 py-2 border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] transition-colors disabled:opacity-50">
                                {loading.avatar ? "Chargement..." : "Modifier"}
                            </button>
                            <input type="file" id="avatar-upload" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </div>
                    </div>
                     <div>
                        <label className="block mb-2">Nom complet</label>
                        <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-[#121926] p-3 rounded border border-[#121926] focus:border-[#FF570A] outline-none" />
                    </div>
                     <div>
                        <label className="block mb-2">Adresse e-mail (non modifiable)</label>
                        <input type="email" value={user.email} disabled className="w-full bg-[#121926] p-3 rounded opacity-50" />
                    </div>
                    <div className="text-right">
                         <button type="submit" disabled={loading.info} className="px-6 py-2 bg-[#FF570A] font-bold rounded hover:bg-opacity-80 transition-colors disabled:opacity-50">
                            {loading.info ? "Enregistrement..." : "Enregistrer les modifications"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-[#1b263b] p-8 rounded-lg border border-white/10">
                <h2 className="text-xl font-bold mb-6">Changer le mot de passe</h2>
                <form className="space-y-6" onSubmit={handlePasswordUpdate}>
                    <div>
                        <label className="block mb-2">Mot de passe actuel</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full bg-[#121926] p-3 rounded border border-[#121926] focus:border-[#FF570A] outline-none" />
                    </div>
                     <div>
                        <label className="block mb-2">Nouveau mot de passe</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-[#121926] p-3 rounded border border-[#121926] focus:border-[#FF570A] outline-none" />
                         <PasswordStrengthIndicator passwordCriteria={passwordCriteria} />
                    </div>
                    <div>
                        <label className="block mb-2">Confirmer le nouveau mot de passe</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-[#121926] p-3 rounded border border-[#121926] focus:border-[#FF570A] outline-none" />
                    </div>
                    <div className="text-right">
                         <button type="submit" disabled={loading.password} className="px-6 py-2 bg-[#FF570A] font-bold rounded hover:bg-opacity-80 transition-colors disabled:opacity-50">
                            {loading.password ? "Mise à jour..." : "Changer le mot de passe"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#1b263b] p-8 rounded-lg border border-red-500/50">
                <h1 className="text-2xl font-bold text-red-400 mb-6">Zone de danger</h1>
                
                {/* Reset Data Section */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-yellow-400 mb-4">Réinitialiser les données</h2>
                    <p className="text-gray-300 mb-6">Cette action supprimera toutes vos données (tâches, notes, projets, etc.) de la plateforme. Votre compte sera conservé, mais votre espace de travail sera vide. Cette action est irréversible.</p>
                    <div>
                        <label htmlFor="reset-confirm" className="block mb-2 font-semibold">Pour confirmer, veuillez taper la phrase exacte : <strong className="text-yellow-300 select-none">{RESET_CONFIRMATION_PHRASE}</strong></label>
                        <input 
                            id="reset-confirm"
                            type="text" 
                            value={resetConfirmation} 
                            onChange={(e) => setResetConfirmation(e.target.value)} 
                            className="w-full max-w-lg bg-[#121926] p-3 rounded border border-[#121926] focus:border-yellow-500 outline-none" 
                        />
                    </div>
                    <div className="mt-6">
                        <button 
                            onClick={handleResetClick} 
                            disabled={resetConfirmation !== RESET_CONFIRMATION_PHRASE || loading.reset} 
                            className="px-6 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading.reset ? "Réinitialisation..." : "Réinitialiser mes données"}
                        </button>
                    </div>
                </div>

                <hr className="border-gray-600 my-8" /> 

                {/* Delete Account Section */}
                <div>
                    <h2 className="text-xl font-bold text-red-400 mb-4">Supprimer le compte</h2>
                    <p className="text-gray-300 mb-6">La suppression de votre compte est une action irréversible. Toutes vos données, y compris les projets, les tâches et les notes, seront définitivement effacées. Cette action ne peut pas être annulée.</p>
                    <div>
                        <label className="block mb-2 font-semibold">Veuillez saisir votre mot de passe pour continuer</label>
                        <input 
                            type="password" 
                            value={deletePassword} 
                            onChange={(e) => setDeletePassword(e.target.value)} 
                            placeholder="Votre mot de passe actuel"
                            className="w-full max-w-sm bg-[#121926] p-3 rounded border border-[#121926] focus:border-red-500 outline-none" 
                        />
                    </div>
                    <div className="mt-6">
                        <button 
                            onClick={handleDeleteClick} 
                            disabled={!deletePassword || loading.delete} 
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading.delete ? "Suppression en cours..." : "Supprimer mon compte"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;