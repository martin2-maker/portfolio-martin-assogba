import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createNotification } from '../../../lib/notifications';
import FileIcon from '../../../components/FileIcon';

// @ts-ignore
const supabase = window.supabase;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121926] rounded-lg shadow-xl w-full max-w-md border border-[#1b263b]">
                <div className="p-4 border-b border-[#1b263b]"><h3 className="text-lg font-bold">Confirmation</h3></div>
                <div className="p-6"><p>{message}</p></div>
                <div className="p-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 font-bold rounded hover:bg-gray-600">Retour</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-[#FF570A] font-bold rounded hover:bg-opacity-80">Continuer</button>
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

interface Attachment { name: string; url: string; type: string; }

interface TaskData {
    id?: number;
    reference: string;
    created_at: string;
    author: string;
    title: string;
    tag: string;
    description: string;
    due_date: string;
    status: string;
    priority: string;
}

const TaskEditorPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(taskId);

    const [taskData, setTaskData] = useState<TaskData>({
        reference: 'Génération...', created_at: new Date().toISOString(), author: '', title: '', tag: '',
        description: '', due_date: '', status: 'En cours', priority: 'Moyenne',
    });
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [userTags, setUserTags] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', isError: false });

    const showToast = (message: string, isError = false) => {
        setToast({ show: true, message, isError });
        setTimeout(() => setToast({ show: false, message: '', isError }), 6000);
    };

    const generateReference = async () => {
        const today = new Date();
        const datePrefix = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).like('reference', `TASK-${datePrefix}-%`);
        const nextId = String((count || 0) + 1).padStart(3, '0');
        return `TASK-${datePrefix}-${nextId}`;
    };

    const fetchTaskAndUser = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/compte'); return; }

        const { data: tagsData, error: tagsError } = await supabase.from('tags').select('id, name').eq('user_id', user.id);
        if (tagsError) {
            const errorMessage = tagsError.message || String(tagsError);
            console.error("Error fetching tags:", errorMessage);
            if (errorMessage.includes("Could not find the table") || errorMessage.includes("does not exist")) {
                showToast("Impossible de charger les tags : la table 'tags' est manquante dans la base de données.", true);
            }
        } else {
            setUserTags(tagsData || []);
        }

        const authorName = user.user_metadata.full_name || user.email;

        if (isEditing) {
            const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
            if (error) { navigate('/dashboard/tasks'); } 
            else {
                setTaskData({ ...data, author: authorName });
                setAttachments(data.attachments || []);
            }
        } else {
            const newRef = await generateReference();
            const defaultTag = (tagsData && tagsData.length > 0) ? tagsData[0].name : '';
            setTaskData(prev => ({ ...prev, author: authorName, reference: newRef, created_at: new Date().toISOString(), tag: defaultTag }));
        }
        setLoading(false);
    }, [taskId, isEditing, navigate]);

    useEffect(() => { fetchTaskAndUser(); }, [fetchTaskAndUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTaskData(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const uploadFile = async (file: File) => {
        const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const fileName = `${Date.now()}_${sanitizedFileName}`;
        const { data, error } = await supabase.storage.from('tasks_files').upload(`attachments/${fileName}`, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('tasks_files').getPublicUrl(data.path);
        return publicUrl;
    };

    const handleSave = async () => {
        if (!taskData.title) {
            showToast('Le titre est obligatoire.', true);
            return;
        }
        setIsSaving(true);
        try {
            let newAttachments = [...attachments];
            if (attachmentFiles.length > 0) {
                for (const file of attachmentFiles) {
                    const url = await uploadFile(file);
                    newAttachments.push({ name: file.name, url, type: file.type });
                }
            }
            
            const payload = { ...taskData, attachments: newAttachments };
    
            if (isEditing) {
                const { id, created_at, reference, author, ...updateData } = payload;
                const { error } = await supabase.from('tasks').update(updateData).eq('id', taskId);
                if (error) throw error;
                await createNotification('TASK_MODIFIED', { title: payload.title });
            } else {
                const { data: { user } } = await supabase.auth.getUser();
                if(!user) throw new Error("User not found");
    
                const { author, ...insertData } = payload;
                const { error } = await supabase.from('tasks').insert([{ ...insertData, user_id: user.id }]);
                if (error) throw error;
                await createNotification('TASK_CREATED', { title: payload.title });
            }
            showToast(`Tâche ${isEditing ? 'mise à jour' : 'créée'} avec succès.`);
            setTimeout(() => navigate('/dashboard/tasks'), 2000);
        } catch (error: any) {
            console.error("Save Task Error:", error);
            let message = error?.message || 'Une erreur est survenue lors de la sauvegarde.';
    
            if (message.includes("Bucket not found")) {
                message = "Erreur de configuration : Le 'bucket' de stockage Supabase 'tasks_files' est manquant. Veuillez le créer dans votre projet Supabase.";
            }
            showToast(message, true);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (attachments.length + attachmentFiles.length + files.length > 5) {
                 showToast('Vous ne pouvez pas attacher plus de 5 fichiers.', true);
                 return;
            }
            
            const validFiles = files.filter((file: File) => allowedTypes.includes(file.type));
            const invalidFiles = files.filter((file: File) => !allowedTypes.includes(file.type));

            if (invalidFiles.length > 0) {
                showToast(`Type de fichier non supporté: ${invalidFiles.map((f: File) => f.name).join(', ')}`, true);
            }

            setAttachmentFiles(prev => [...prev, ...validFiles]);
        }
    }

    const removeStagedFile = (index: number) => {
        setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="font-sans-fallback text-white space-y-6">
            <Toast message={toast.message} isVisible={toast.show} isError={toast.isError} />
            <ConfirmationModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} onConfirm={() => navigate('/dashboard/tasks')} message="Les informations saisies ne seront pas sauvegardées. Souhaitez-vous continuer ?" />

            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">{isEditing ? 'Modifier la tâche' : 'Ajouter une tâche'}</h1>
                <div className="flex gap-4">
                    <button onClick={() => setIsCancelModalOpen(true)} className="px-4 py-2 bg-gray-700 font-bold rounded hover:bg-gray-600">Annuler</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-[#FF570A] font-bold rounded hover:bg-opacity-80 disabled:opacity-50">
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </header>

            {loading ? <p>Chargement...</p> :
            <div className="bg-[#121926] p-6 space-y-6">
                <div><label>Référence</label><input type="text" value={taskData.reference} disabled className="w-full mt-2 bg-[#1b263b] p-3 rounded opacity-50"/></div>
                <div><label>Date de création</label><input type="text" value={new Date(taskData.created_at).toLocaleDateString('fr-FR')} disabled className="w-full mt-2 bg-[#1b263b] p-3 rounded opacity-50"/></div>
                <div><label>Auteur</label><input type="text" value={taskData.author} disabled className="w-full mt-2 bg-[#1b263b] p-3 rounded opacity-50" /></div>
                <div><label>Titre *</label><input type="text" name="title" value={taskData.title} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-transparent focus:border-[#FF570A] p-3 rounded outline-none" /></div>
                <div>
                    <label>Tag</label>
                    <select name="tag" value={taskData.tag} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-transparent focus:border-[#FF570A] p-3 rounded outline-none">
                            {userTags.length > 0 ? (
                            userTags.map(tag => <option key={tag.id} value={tag.name}>{tag.name}</option>)
                        ) : (
                            <option value="">Créez un tag d'abord</option>
                        )}
                    </select>
                </div>
                <div><label>Description</label><textarea rows={5} name="description" value={taskData.description} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-transparent focus:border-[#FF570A] p-3 rounded outline-none"></textarea></div>
                <div><label>Date limite</label><input type="date" name="due_date" value={taskData.due_date} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-transparent focus:border-[#FF570A] p-3 rounded outline-none" style={{ colorScheme: 'dark' }}/></div>
                <div><label>Statut</label><select name="status" value={taskData.status} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-transparent focus:border-[#FF570A] p-3 rounded outline-none"><option>En cours</option><option>Terminé</option><option>En attente</option></select></div>
                <div><label>Priorité</label><select name="priority" value={taskData.priority} onChange={handleInputChange} className="w-full mt-2 bg-[#1b263b] border border-transparent focus:border-[#FF570A] p-3 rounded outline-none"><option>Moyenne</option><option>Haute</option><option>Basse</option></select></div>

                <div>
                    <label>Fichiers attachés (max 5, types: JPG, PNG, PDF, DOC, DOCX)</label>
                    <div className="mt-2 p-4 border-2 border-dashed border-[#1b263b] rounded-lg">
                        <ul className="space-y-2 mb-4">
                            {attachments.map((file, i) => (
                                <li key={`att-${i}`} className="text-sm flex items-center gap-3 bg-[#1b263b] p-2 rounded">
                                    <FileIcon type={file.type} className="text-2xl" />
                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex-1 truncate">{file.name}</a>
                                </li>
                            ))}
                            {attachmentFiles.map((file, i) => (
                                <li key={`new-${i}`} className="text-sm flex items-center justify-between gap-2 bg-[#1b263b] p-2 rounded">
                                    <div className="flex items-center gap-3 flex-1 truncate">
                                        <FileIcon type={file.type} className="text-2xl" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                    <button onClick={() => removeStagedFile(i)} className="text-red-500 hover:text-red-400">
                                        <i className="fas fa-times-circle"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {(attachments.length + attachmentFiles.length) < 5 && (
                            <>
                                <input type="file" multiple id="files-upload" onChange={handleAttachmentChange} className="hidden" />
                                <label htmlFor="files-upload" className="cursor-pointer text-center block py-4 border border-dashed border-gray-500 rounded hover:bg-[#1b263b]">
                                    <i className="fas fa-paperclip text-3xl mb-2"></i><p>Ajouter des fichiers</p>
                                </label>
                            </>
                        )}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default TaskEditorPage;
