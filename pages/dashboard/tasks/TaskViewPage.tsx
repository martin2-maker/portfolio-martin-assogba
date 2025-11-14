import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FileIcon from '../../../components/FileIcon';

// @ts-ignore
const supabase = window.supabase;

interface Task {
    id: number;
    reference: string;
    created_at: string;
    title: string;
    tag: string;
    description: string;
    due_date: string;
    status: string;
    priority: string;
    attachments: { name: string; url: string; type: string }[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Terminé': return 'bg-green-500';
        case 'En attente': return 'bg-yellow-500';
        default: return 'bg-blue-500'; // En cours
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'Haute': return 'border-red-500';
        case 'Basse': return 'border-green-500';
        default: return 'border-yellow-500'; // Moyenne
    }
};

const TaskViewPage = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTask = useCallback(async () => {
        if (!taskId) return;
        setLoading(true);
        const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
        if (error) {
            navigate('/dashboard/tasks');
        } else {
            setTask(data);
        }
        setLoading(false);
    }, [taskId, navigate]);

    useEffect(() => { fetchTask(); }, [fetchTask]);

    if (loading) return <div className="text-center p-10">Chargement de la tâche...</div>
    if (!task) return <div className="text-center p-10">Tâche non trouvée.</div>

    return (
        <div className="font-sans-fallback text-white space-y-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-xl md:text-2xl font-bold">Détails de la tâche : {task.reference}</h1>
                 <div className="flex gap-4">
                    <button onClick={() => navigate('/dashboard/tasks')} className="px-4 py-2 bg-gray-700 font-bold rounded hover:bg-gray-600">Retour</button>
                    <button onClick={() => navigate(`/dashboard/tasks/edit/${task.id}`)} className="px-4 py-2 bg-[#FF570A] font-bold rounded hover:bg-opacity-80">Modifier</button>
                </div>
            </header>
            
            <div className={`space-y-6 bg-[#121926] p-4 md:p-8 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-[28px] font-bold text-white">{task.title}</h2>
                        <p className="text-[#BFC9D9]">Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                     <span className={`px-3 py-1 text-sm font-bold rounded-full text-white ${getStatusColor(task.status)}`}>{task.status}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-[#1b263b] p-3 rounded">
                        <p className="text-sm text-gray-400">Priorité</p>
                        <p className="font-bold">{task.priority}</p>
                    </div>
                     <div className="bg-[#1b263b] p-3 rounded">
                        <p className="text-sm text-gray-400">Date Limite</p>
                        <p className="font-bold">{task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : 'N/A'}</p>
                    </div>
                     <div className="bg-[#1b263b] p-3 rounded">
                        <p className="text-sm text-gray-400">Tag</p>
                        <p className="font-bold">{task.tag || 'N/A'}</p>
                    </div>
                </div>

                {task.description && (
                    <div>
                        <h3 className="text-xl font-bold mb-2 border-t border-[#1b263b] pt-6">Description</h3>
                        <p className="text-white/80 whitespace-pre-wrap">{task.description}</p>
                    </div>
                )}

                {task.attachments && task.attachments.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-t border-[#1b263b] pt-6">Fichiers attachés</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {task.attachments.map((file, index) => (
                                <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="block border border-[#1b263b] rounded-lg p-4 text-center hover:border-[#FF570A] transition-colors">
                                    <div className="h-20 flex items-center justify-center">
                                        <FileIcon type={file.type} />
                                    </div>
                                    <span className="text-sm truncate block mt-2">{file.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskViewPage;