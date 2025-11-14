import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createNotification } from '../../../lib/notifications';

// @ts-ignore
const supabase = window.supabase;

interface Note {
  id: number;
  reference: string;
  created_at: string;
  author: string;
  title: string;
  tag: string;
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
                    <button onClick={onClose} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">Annuler</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">Supprimer</button>
                </div>
            </div>
        </div>
    );
};


const NotesListPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInitialFetch, setIsInitialFetch] = useState(true);
    const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNotes = useCallback(async () => {
        setLoading(true);

        let query = supabase.from('notes').select('id, reference, created_at, author, title, tag').order('created_at', { ascending: false });

        if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,tag.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching notes:", error.message || error);
        } else {
            setNotes(data || []);
        }
        setLoading(false);
        if (isInitialFetch) setIsInitialFetch(false);
    }, [searchTerm, isInitialFetch]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSelectNote = (id: number) => {
        setSelectedNotes(prev =>
            prev.includes(id) ? prev.filter(noteId => noteId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedNotes(notes.map(n => n.id));
        } else {
            setSelectedNotes([]);
        }
    };
    
    const openDeleteModal = (note: Note) => {
        setNoteToDelete(note);
        setIsModalOpen(true);
    };

    const openBatchDeleteModal = () => {
        setNoteToDelete(null); // Indicates batch delete
        setIsModalOpen(true);
    };
    
    const handleDelete = async () => {
        let error;
        if (noteToDelete) { // Single delete
            const title = noteToDelete.title;
            ({ error } = await supabase.from('notes').delete().match({ id: noteToDelete.id }));
            if (!error) {
                await createNotification('NOTE_DELETED', { title });
            }
        } else { // Batch delete
             ({ error } = await supabase.from('notes').delete().in('id', selectedNotes));
             setSelectedNotes([]);
        }

        if (error) {
            console.error("Error deleting note(s):", error.message || error);
        } else {
            fetchNotes(); // Refresh list after delete
        }
        
        setIsModalOpen(false);
        setNoteToDelete(null);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
    };
    
    const isFilterActive = searchTerm;

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={noteToDelete ? `Supprimer la note : ${noteToDelete.reference}` : `Supprimer les notes sélectionnées : ${selectedNotes.length} sélectionnées`}
                message={noteToDelete ? "Voulez-vous vraiment supprimer cette note ? Cette action est irréversible." : "Voulez-vous vraiment supprimer ces notes ? Cette action est irréversible."}
            />
            
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">Liste de vos Notes</h1>
                <div className="flex gap-4">
                    <Link to="/dashboard/notes/new" className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">Ajouter une note</Link>
                </div>
            </header>

            <div className="bg-[#121926] p-4 flex items-end gap-4">
                <div className="flex-grow">
                    <input type="text" placeholder="Rechercher par référence, tag ou titre" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchNotes()} className="w-full h-[50px] bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none text-white" />
                </div>
                 <button onClick={fetchNotes} className="h-[50px] px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">Rechercher</button>
                 {isFilterActive && <button onClick={handleResetFilters} className="h-[50px] px-4 py-2 bg-[#121926] border border-gray-500 text-white font-bold rounded hover:bg-gray-500 transition-colors">Réinitialiser</button>}
            </div>
            
             {selectedNotes.length >= 2 && (
                <div className="flex justify-end p-2 -mt-4">
                    <button onClick={openBatchDeleteModal} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">
                        Supprimer la sélection ({selectedNotes.length})
                    </button>
                </div>
            )}

            <div className="overflow-x-auto bg-[#121926]">
                <table className="w-full min-w-max text-left text-[18px]">
                    <thead className="bg-[#141922]">
                        <tr className="border-b border-[#1b263b]">
                            <th className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={notes.length > 0 && selectedNotes.length === notes.length} className="w-5 h-5 accent-[#FF570A]" /></th>
                            <th className="p-4 border-l border-r border-[#1b263b] whitespace-nowrap">Référence</th>
                            <th className="p-4 border-r border-[#1b263b] whitespace-nowrap">Date de création</th>
                            <th className="p-4 border-r border-[#1b263b] whitespace-nowrap">Auteur</th>
                            <th className="p-4 border-r border-[#1b263b]">Titre</th>
                            <th className="p-4 border-r border-[#1b263b]">Tag</th>
                            <th className="p-4 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center p-16">Chargement des notes...</td></tr>
                        ) : notes.length > 0 ? notes.map((note, index) => (
                            <tr key={note.id} className={`border-b border-[#1b263b] hover:bg-[#1C2A23] ${index % 2 === 1 ? 'bg-[#1C2432]' : ''}`}>
                                <td className="p-4 border-l border-[#1b263b]"><input type="checkbox" checked={selectedNotes.includes(note.id)} onChange={() => handleSelectNote(note.id)} className="w-5 h-5 accent-[#FF570A]" /></td>
                                <td onClick={() => navigate(`/dashboard/notes/view/${note.id}`)} className="p-4 cursor-pointer border-l border-r border-[#1b263b] whitespace-nowrap">{note.reference}</td>
                                <td onClick={() => navigate(`/dashboard/notes/view/${note.id}`)} className="p-4 cursor-pointer border-r border-[#1b263b] whitespace-nowrap">{new Date(note.created_at).toLocaleDateString('fr-FR')}</td>
                                <td onClick={() => navigate(`/dashboard/notes/view/${note.id}`)} className="p-4 cursor-pointer border-r border-[#1b263b] whitespace-nowrap">{note.author}</td>
                                <td onClick={() => navigate(`/dashboard/notes/view/${note.id}`)} className="p-4 cursor-pointer border-r border-[#1b263b]">{note.title}</td>
                                <td onClick={() => navigate(`/dashboard/notes/view/${note.id}`)} className="p-4 cursor-pointer border-r border-[#1b263b]"><span className="bg-[#FF570A] text-[#121926] px-2 py-1 rounded text-sm font-bold">{note.tag}</span></td>
                                <td className="p-4 flex gap-4 text-xl border-r border-[#1b263b]">
                                    <button onClick={() => navigate(`/dashboard/notes/view/${note.id}`)} title="Prévisualiser"><i className="fas fa-eye hover:text-[#FF570A]"></i></button>
                                    <button onClick={() => navigate(`/dashboard/notes/edit/${note.id}`)} title="Modifier"><i className="fas fa-pencil-alt hover:text-[#FF570A]"></i></button>
                                    <button onClick={() => openDeleteModal(note)} title="Supprimer"><i className="fas fa-trash-alt hover:text-red-500"></i></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center p-16 text-white/70">
                                    {isInitialFetch ? "Aucune note n’a encore été créée. Créez votre première note pour commencer." : "Aucune note ne correspond à vos critères de recherche. Essayez avec d’autres filtres."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NotesListPage;
