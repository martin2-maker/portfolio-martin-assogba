import React, { useState, useEffect, useCallback } from 'react';

// @ts-ignore
const supabase = window.supabase;

interface Tag {
    id: number;
    name: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
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
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors">Supprimer</button>
                </div>
            </div>
        </div>
    );
};

const TagsManagementPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [error, setError] = useState('');
    const [configError, setConfigError] = useState('');

    const fetchTags = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('tags').select('id, name').eq('user_id', user.id).order('name', { ascending: true });
        if (error) {
            const errorMessage = error.message || String(error);
            console.error("Error fetching tags:", errorMessage);
            if (errorMessage.includes("Could not find the table") || errorMessage.includes("does not exist")) {
                setConfigError("Erreur de configuration : La table 'tags' est manquante dans votre base de données. Veuillez la créer pour utiliser cette fonctionnalité.");
            }
        } else {
            setTags(data || []);
            setConfigError(''); // Clear error on successful fetch
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const handleAddTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName.trim()) {
            setError('Le nom du tag ne peut pas être vide.');
            return;
        }
        if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
            setError('Ce tag existe déjà.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('tags').insert([{ name: newTagName.trim(), user_id: user.id }]);
        if (error) {
            const errorMessage = error.message || String(error);
            console.error("Error adding tag:", errorMessage);
            const friendlyError = errorMessage.includes("Could not find the table") || errorMessage.includes("does not exist")
                ? "Impossible d'ajouter : la table 'tags' est manquante."
                : "Erreur lors de l'ajout du tag.";
            setError(friendlyError);
        } else {
            setNewTagName('');
            fetchTags();
        }
        setIsSubmitting(false);
    };

    const openDeleteModal = (tag: Tag) => {
        setTagToDelete(tag);
        setIsModalOpen(true);
    };

    const handleDeleteTag = async () => {
        if (!tagToDelete) return;

        const { error: deleteError } = await supabase.from('tags').delete().match({ id: tagToDelete.id });
        if (deleteError) {
            const errorMessage = deleteError.message || String(deleteError);
            console.error("Error deleting tag:", errorMessage);
        } else {
            fetchTags();
        }
        setIsModalOpen(false);
        setTagToDelete(null);
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteTag}
                title={`Supprimer le tag "${tagToDelete?.name}"`}
                message="Voulez-vous vraiment supprimer ce tag ? Il sera retiré de toutes les notes et tâches associées."
            />
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">Gestion des Tags</h1>
            </header>
            
            {configError && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg text-red-200">
                        <h3 className="font-bold text-lg"><i className="fas fa-exclamation-triangle mr-2"></i>Erreur de configuration</h3>
                        <p>{configError}</p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-[#1b263b] p-6 rounded-lg border border-white/10">
                    <h2 className="text-xl font-bold mb-4">Ajouter un nouveau tag</h2>
                    <form onSubmit={handleAddTag} className="flex items-start gap-4">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Nom du nouveau tag"
                                className="w-full h-[50px] bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none"
                            />
                             {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                        <button type="submit" disabled={isSubmitting || !!configError} className="h-[50px] px-6 bg-[#FF570A] text-white font-bold rounded hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Ajout...' : 'Ajouter'}
                        </button>
                    </form>
                </div>

                <div className="bg-[#1b263b] p-6 rounded-lg border border-white/10">
                    <h2 className="text-xl font-bold mb-4">Mes Tags ({tags.length})</h2>
                    {loading ? (
                        <p>Chargement des tags...</p>
                    ) : tags.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {tags.map(tag => (
                                <div key={tag.id} className="flex items-center gap-2 bg-[#121926] pl-3 pr-2 py-1 rounded-full">
                                    <span className="font-semibold">{tag.name}</span>
                                    <button onClick={() => openDeleteModal(tag)} className="text-gray-400 hover:text-red-500 text-xs">
                                        <i className="fas fa-times-circle"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">
                            {configError ? "Veuillez d'abord résoudre l'erreur de configuration." : "Vous n'avez encore créé aucun tag."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagsManagementPage;