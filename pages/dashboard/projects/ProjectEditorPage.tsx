import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../lib/notifications';
import FileIcon from '../../../components/FileIcon';

// @ts-ignore
const supabase = window.supabase;
// This is a placeholder for the emailjs library loaded from CDN
declare const emailjs: any;

const Toast = ({ message, isVisible, isError = false }: { message: string, isVisible: boolean, isError?: boolean }) => {
    if (!isVisible) return null;
    return (
        <div className={`fixed bottom-5 right-5 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
            {message}
        </div>
    );
};

const ProjectEditorPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [subject, setSubject] = useState('');
    const [otherSubject, setOtherSubject] = useState('');
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', isError: false });
    const [creationDate, setCreationDate] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setAuthor(user.user_metadata.full_name || user.email || '');
            } else {
                navigate('/compte');
            }
        };
        fetchUser();
        setCreationDate(new Date().toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }));
    }, [navigate]);

    const showToast = (message: string, isError = false) => {
        setToast({ show: true, message, isError });
        setTimeout(() => setToast({ show: false, message: '', isError }), 6000);
    };

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (attachmentFiles.length + files.length > 5) {
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
    };

    const removeStagedFile = (index: number) => {
        setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFile = async (file: File) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Utilisateur non authentifié.");

        const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filePath = `${user.id}/${Date.now()}_${sanitizedFileName}`;
        
        const { error } = await supabase.storage.from('projects_files').upload(filePath, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from('projects_files').getPublicUrl(filePath);
        return { name: file.name, url: publicUrl, type: file.type };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !subject.trim()) {
            showToast('Le titre, la description et l\'objet sont obligatoires.', true);
            return;
        }
        if (subject === 'Autre' && !otherSubject.trim()) {
            showToast("Veuillez préciser l'objet.", true);
            return;
        }
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Utilisateur non authentifié.");

            // 1. Upload files
            const uploadedAttachments = await Promise.all(attachmentFiles.map(uploadFile));

            // 2. Save to Supabase
            const finalSubject = subject === 'Autre' ? otherSubject : subject;
            const finalDescription = `Objet: ${finalSubject}\n\n${description}`;
            const { error: dbError } = await supabase.from('projects').insert([{
                user_id: user.id,
                title,
                description: finalDescription,
                attachments: uploadedAttachments,
                status: 'En attente',
            }]);
            if (dbError) throw dbError;
            
            // 3. Send email via EmailJS using the new template structure
            const attachmentLinks = uploadedAttachments.map(file => `<a href="${file.url}" target="_blank">${file.name}</a>`).join('<br>');
            
            const templateParams = {
                from_name: author,
                reply_to: user.email,
                project_title: title,
                project_subject: finalSubject,
                project_description: description,
                attachment_links: attachmentLinks || "Aucune"
            };

            await emailjs.send("service_0zl2xjr", "template_cksgjds", templateParams);
            
            // 4. Create notification
            await createNotification('PROJECT_SUBMITTED', { title });

            showToast('Projet soumis avec succès !');
            setTimeout(() => navigate('/dashboard/projects'), 2000);

        } catch (error: any) {
            console.error("Project Submission Error:", error);
            let message = 'Une erreur est survenue lors de la soumission.';

            if (typeof error === 'string') {
                message = error;
            } else if (error && typeof error === 'object') {
                // EmailJS error object has 'text' property
                if (typeof error.text === 'string') {
                    message = `Erreur EmailJS: ${error.text}`;
                } 
                // Supabase error or generic Error has 'message' property
                else if (typeof error.message === 'string') {
                    message = error.message;
                } else {
                     try {
                        // Attempt to stringify for more details, fallback if it fails
                        message = JSON.stringify(error);
                    } catch (e) {
                        message = "Une erreur objet inattendue est survenue.";
                    }
                }
            }
        
            if (message.includes("Bucket not found")) {
                message = "Erreur de configuration : Le 'bucket' de stockage Supabase 'projects_files' est manquant. Veuillez le créer dans votre projet Supabase.";
            }
            showToast(message, true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <Toast message={toast.message} isVisible={toast.show} isError={toast.isError} />
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">Soumettre un nouveau projet pour audit</h1>
                <button onClick={() => navigate('/dashboard/projects')} className="px-4 py-2 bg-gray-700 font-bold rounded hover:bg-gray-600">
                    Retour à la liste
                </button>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#1b263b] p-6 rounded-lg border border-white/10 space-y-6">
                <div>
                    <label className="block mb-2 font-semibold">Titre du projet *</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                </div>
                 <div>
                    <label className="block mb-2 font-semibold">Date de création</label>
                    <input type="text" value={creationDate} disabled className="w-full bg-[#121926] p-3 rounded opacity-50" />
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Auteur</label>
                    <input type="text" value={author} disabled className="w-full bg-[#121926] p-3 rounded opacity-50" />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Objet *</label>
                    <select value={subject} onChange={e => setSubject(e.target.value)} required className="w-full bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none">
                        <option value="">Sélectionnez un objet</option>
                        <option>Devis ou estimation de projet</option>
                        <option>Collaboration ou partenariat</option>
                        <option>Support ou assistance technique</option>
                        <option>Création de landing page</option>
                        <option>Création de tunnel de vente</option>
                        <option>Création d'une application SaaS no-code</option>
                        <option>Intégration API personnalisée</option>
                        <option>Création d’outil IA personnalisé</option>
                        <option>Intégration d’IA dans un site ou une app</option>
                        <option>Conception de site web complet</option>
                        <option>Refonte ou amélioration d’un site existant</option>
                        <option value="Autre">Autre (à préciser)</option>
                    </select>
                </div>

                {subject === 'Autre' && (
                    <div>
                        <label className="block mb-2 font-semibold">Précisez l'objet *</label>
                        <input type="text" value={otherSubject} onChange={e => setOtherSubject(e.target.value)} required className="w-full bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                    </div>
                )}

                <div>
                    <label className="block mb-2 font-semibold">Description détaillée *</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={8} className="w-full bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none"></textarea>
                </div>
                <div>
                    <label className="block mb-2 font-semibold">Pièces jointes (max 5)</label>
                    <div className="p-4 border-2 border-dashed border-[#121926] rounded-lg">
                       <ul className="space-y-2 mb-4">
                           {attachmentFiles.map((file, i) => (
                               <li key={i} className="text-sm flex items-center justify-between gap-2 bg-[#121926] p-2 rounded">
                                   <div className="flex items-center gap-3 flex-1 truncate">
                                       <FileIcon type={file.type} className="text-2xl" />
                                       <span className="truncate">{file.name}</span>
                                   </div>
                                   <button type="button" onClick={() => removeStagedFile(i)} className="text-red-500 hover:text-red-400">
                                       <i className="fas fa-times-circle"></i>
                                   </button>
                               </li>
                           ))}
                       </ul>
                       {attachmentFiles.length < 5 && (
                           <>
                               <input type="file" multiple id="files-upload" onChange={handleAttachmentChange} className="hidden" />
                               <label htmlFor="files-upload" className="cursor-pointer text-center block py-4 border border-dashed border-gray-500 rounded hover:bg-[#121926]">
                                   <i className="fas fa-paperclip text-3xl mb-2"></i><p>Ajouter des fichiers (PDF, DOC, PNG, JPG)</p>
                               </label>
                           </>
                       )}
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#FF570A] text-white font-bold rounded hover:bg-opacity-80 transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer pour audit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectEditorPage;