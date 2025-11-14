import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createNotification } from '../../../lib/notifications';

// @ts-ignore
const supabase = window.supabase;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121926] rounded-lg shadow-xl w-full max-w-md border border-[#1b263b]">
                <div className="p-4 border-b border-[#1b263b]">
                    <h3 className="text-lg font-bold">Confirmation</h3>
                </div>
                <div className="p-6">
                    <p>{message}</p>
                </div>
                <div className="p-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-[#121926] border border-gray-500 text-white font-bold rounded hover:bg-gray-700 transition-colors">Retour</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">Continuer</button>
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message, isVisible, isError = false }: { message: string, isVisible: boolean, isError?: boolean }) => {
    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-5 right-5 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
            {message}
        </div>
    );
};

interface Attachment {
    name: string;
    url: string;
    type: string;
}

const NoteEditorPage = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(noteId);

    const [noteData, setNoteData] = useState({
        reference: 'Génération...',
        created_at: new Date().toISOString(),
        author: '',
        title: '',
        tag: '',
        description: '',
        content: '',
        cover_url: '',
    });
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [userTags, setUserTags] = useState<{ id: number; name: string }[]>([]);

    const [loading, setLoading] = useState(true);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const generateReference = async () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${yyyy}-${mm}-${dd}`;

        const { count, error } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${datePrefix}T00:00:00.000Z`)
            .lte('created_at', `${datePrefix}T23:59:59.999Z`);
        
        if (error) {
            console.error(error);
            return `NOTE-${yyyy}${mm}${dd}-ERR`;
        }
        
        const nextId = String((count || 0) + 1).padStart(3, '0');
        return `NOTE-${yyyy}${mm}${dd}-${nextId}`;
    };

    const fetchNoteAndUser = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            navigate('/compte');
            return;
        }

        // Fetch user tags
        const { data: tagsData, error: tagsError } = await supabase.from('tags').select('id, name').eq('user_id', user.id);
        if (tagsError) {
            const errorMessage = tagsError.message || String(tagsError);
            console.error("Error fetching tags:", errorMessage);
            if (errorMessage.includes("Could not find the table") || errorMessage.includes("does not exist")) {
                setErrorMessage("Impossible de charger les tags : la table 'tags' est manquante dans la base de données.");
                setShowErrorToast(true);
            }
        } else {
            setUserTags(tagsData || []);
        }
        
        const authorName = user.user_metadata.full_name || user.email;

        if (isEditing) {
            const { data, error } = await supabase.from('notes').select('*').eq('id', noteId).single();
            if (error || !data) {
                console.error(error);
                navigate('/dashboard/notes');
            } else {
                setNoteData(data);
                setAttachments(data.attachments || []);
            }
        } else {
            const newRef = await generateReference();
            const defaultTag = (tagsData && tagsData.length > 0) ? tagsData[0].name : '';
            setNoteData(prev => ({ ...prev, author: authorName, reference: newRef, created_at: new Date().toISOString(), tag: defaultTag }));
        }
        setLoading(false);
    }, [noteId, isEditing, navigate]);

    useEffect(() => {
        fetchNoteAndUser();
    }, [fetchNoteAndUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNoteData(prev => ({...prev, [name]: value }));
    };
    
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
    
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        img.onload = () => {
            if (img.width !== 1920 || img.height !== 1080) {
                setErrorMessage("L'image de couverture doit être au format 1920x1080 pixels.");
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 4000);
                if (e.target) e.target.value = ''; // Reset file input
                setCoverFile(null);
            } else {
                setCoverFile(file);
            }
            URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
            setErrorMessage("Impossible de charger le fichier image.");
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 4000);
            if (e.target) e.target.value = '';
            setCoverFile(null);
            URL.revokeObjectURL(objectUrl);
        }
    };

    const uploadFile = async (file: File, folder: string) => {
        const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const { data, error } = await supabase.storage.from('notes_files').upload(`${folder}/${fileName}`, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('notes_files').getPublicUrl(data.path);
        return publicUrl;
    };

    const handleSave = async () => {
        if (!noteData.title || !noteData.description || !noteData.content) {
            setErrorMessage('Titre, Description et Contenu complet sont obligatoires.');
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 4000);
            return;
        }

        setLoading(true);
        try {
            let coverUrl = noteData.cover_url;
            if (coverFile) {
                coverUrl = await uploadFile(coverFile, 'covers');
            }

            let newAttachments = [...attachments];
            if (attachmentFiles.length > 0) {
                for (const file of attachmentFiles) {
                    const url = await uploadFile(file, 'attachments');
                    newAttachments.push({ name: file.name, url, type: file.type });
                }
            }
            
            const finalNoteData = { ...noteData, cover_url: coverUrl, attachments: newAttachments };

            if (isEditing) {
                const { error } = await supabase.from('notes').update(finalNoteData).eq('id', noteId);
                if (error) throw error;
                await createNotification('NOTE_MODIFIED', { title: finalNoteData.title });
            } else {
                const { data: { user } } = await supabase.auth.getUser();
                const { error } = await supabase.from('notes').insert([{ ...finalNoteData, user_id: user.id }]);
                if (error) throw error;
                await createNotification('NOTE_CREATED', { title: finalNoteData.title });
            }

            setShowSuccessToast(true);
            setTimeout(() => {
                setShowSuccessToast(false);
                navigate('/dashboard/notes');
            }, 3000);

        } catch (error: any) {
            console.error("Save Note Error:", error);
            let message = error.message || 'Une erreur est survenue.';
            if (typeof message === 'string' && message.includes("Bucket not found")) {
                message = "Erreur de configuration : Le 'bucket' de stockage Supabase 'notes_files' est manquant. Veuillez le créer dans votre projet Supabase.";
            }
            setErrorMessage(message);
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 6000);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => navigate('/dashboard/notes');

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (attachments.length + files.length > 5) {
                 setErrorMessage('Vous ne pouvez pas attacher plus de 5 fichiers.');
                 setShowErrorToast(true);
                 setTimeout(() => setShowErrorToast(false), 4000);
                 return;
            }
            setAttachmentFiles(files);
        }
    }

    return (
        <div className="font-sans-fallback text-white space-y-6">
            <Toast message="✅ Les modifications ont été enregistrées avec succès." isVisible={showSuccessToast} />
            <Toast message={`❌ Erreur: ${errorMessage}`} isVisible={showErrorToast} isError />
            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancel}
                message="Les informations saisies ne seront pas sauvegardées. Souhaitez-vous continuer ?"
            />

            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">{isEditing ? 'Modifier une note' : 'Ajouter une note'}</h1>
                <div className="flex gap-4">
                    <button onClick={() => setIsCancelModalOpen(true)} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">Annuler</button>
                    <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors disabled:opacity-50">
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </header>

            {loading && !noteData.author ? <p>Chargement...</p> :
            <div className="bg-[#121926] p-6 space-y-6">
                <div><label>Référence</label><input type="text" value={noteData.reference} disabled className="w-full mt-2 bg-[#1b263b] p-3 rounded opacity-50"/></div>
                <div><label>Date de création</label><input type="text" value={new Date(noteData.created_at).toLocaleDateString('fr-FR')} disabled className="w-full mt-2 bg-[#1b263b] p-3 rounded opacity-50"/></div>
                <div><label>Auteur</label><input type="text" value={noteData.author} disabled className="w-full mt-2 bg-[#1b263b] p-3 rounded opacity-50"/></div>
                <div><label>Titre *</label><input type="text" name="title" value={noteData.title} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none" /></div>
                <div>
                    <label>Tag</label>
                    <select name="tag" value={noteData.tag} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none">
                        {userTags.length > 0 ? (
                            userTags.map(tag => <option key={tag.id} value={tag.name}>{tag.name}</option>)
                        ) : (
                            <option value="">Créez un tag d'abord</option>
                        )}
                    </select>
                </div>
                <div>
                    <label>Description courte *</label>
                    <textarea rows={3} name="description" value={noteData.description} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none"></textarea>
                </div>
                <div>
                    <label>Contenu complet *</label>
                    <textarea 
                        rows={15} 
                        name="content" 
                        value={noteData.content} 
                        onChange={handleInputChange} 
                        className="w-full mt-2 bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none"
                    ></textarea>
                </div>
                <div>
                    <label>Image de couverture (1920x1080)</label>
                    <div className="mt-2 h-48 border-2 border-dashed border-[#1b263b] rounded-lg flex items-center justify-center relative">
                       <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="cover-upload" onChange={handleCoverChange} />
                       {coverFile ? <p>{coverFile.name}</p> : noteData.cover_url ? <img src={noteData.cover_url} alt="cover preview" className="w-full h-full object-cover rounded-lg" /> : <span className="text-center"><i className="fas fa-upload text-3xl mb-2"></i><p>Cliquez ou glissez pour uploader</p></span> }
                    </div>
                </div>
                 <div>
                    <label>Fichiers attachés (max 5)</label>
                    <div className="mt-2 h-48 border-2 border-dashed border-[#1b263b] rounded-lg p-2 overflow-y-auto">
                       <input type="file" multiple className="hidden" id="files-upload" onChange={handleAttachmentChange} />
                       <label htmlFor="files-upload" className="cursor-pointer text-center block py-4 border border-dashed border-gray-500 rounded hover:bg-[#1b263b]">
                           <i className="fas fa-paperclip text-3xl mb-2"></i><p>Ajouter des fichiers</p>
                       </label>
                       <ul className="mt-2 space-y-1">
                           {attachments.map((file, i) => <li key={`existing-${i}`} className="text-sm">{file.name}</li>)}
                           {attachmentFiles && attachmentFiles.map((file: File, i) => <li key={`new-${i}`} className="text-sm">{file.name}</li>)}
                       </ul>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default NoteEditorPage;