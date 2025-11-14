import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createNotification } from '../../../lib/notifications';

// @ts-ignore
const supabase = window.supabase;

interface Task {
  id: number;
  reference: string;
  created_at: string;
  title: string;
  tag: string;
  due_date: string;
  status: string;
  priority: string;
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Terminé': return 'bg-green-500';
        case 'En attente': return 'bg-yellow-500';
        default: return 'bg-blue-500'; // En cours
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'Haute': return 'text-red-500';
        case 'Basse': return 'text-green-500';
        default: return 'text-yellow-500'; // Moyenne
    }
};

const TasksListPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

        if (searchTerm) {
            query = query.or(`title.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%`);
        }
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;
        if (error) console.error("Error fetching tasks:", error.message);
        else setTasks(data || []);
        setLoading(false);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);
    
    const handleSelectTask = (id: number) => {
        setSelectedTasks(prev => prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTasks(e.target.checked ? tasks.map(t => t.id) : []);
    };
    
    const openDeleteModal = (task: Task) => {
        setTaskToDelete(task);
        setIsModalOpen(true);
    };

    const openBatchDeleteModal = () => {
        setTaskToDelete(null); // Indicates batch delete
        setIsModalOpen(true);
    };
    
    const handleDelete = async () => {
        if (taskToDelete) {
            const { error } = await supabase.from('tasks').delete().match({ id: taskToDelete.id });
            if (!error) await createNotification('TASK_DELETED', { title: taskToDelete.title });
        } else {
             const { error } = await supabase.from('tasks').delete().in('id', selectedTasks);
             if (!error) {
                // We don't send individual notifications for batch delete to avoid spam
                setSelectedTasks([]);
             }
        }
        setIsModalOpen(false);
        setTaskToDelete(null);
        fetchTasks();
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={taskToDelete ? `Supprimer la tâche : ${taskToDelete.reference}` : `Supprimer ${selectedTasks.length} tâches`}
                message="Voulez-vous vraiment supprimer ces éléments ? Cette action est irréversible."
            />
            
            <header className="flex justify-between items-center p-4">
                <h1 className="text-[23px] font-bold">Liste de vos Tâches</h1>
                <Link to="/dashboard/tasks/new" className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">
                    Ajouter une tâche
                </Link>
            </header>

            <div className="bg-[#121926] p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <input type="text" placeholder="Rechercher par titre/réf..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="md:col-span-2 h-[50px] bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-[50px] bg-[#1b263b] border border-[#1b263b] focus:border-[#FF570A] p-3 rounded outline-none">
                    <option value="">Tous les statuts</option>
                    <option>En cours</option><option>Terminé</option><option>En attente</option>
                </select>
            </div>
            
             {selectedTasks.length >= 2 && (
                <div className="flex justify-end p-2 -mt-4">
                    <button onClick={openBatchDeleteModal} className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors">
                        Supprimer la sélection ({selectedTasks.length})
                    </button>
                </div>
            )}

            <div className="overflow-x-auto bg-[#121926]">
                <table className="w-full min-w-max text-left text-[16px]">
                    <thead className="bg-[#141922]">
                        <tr className="border-b border-[#1b263b]">
                            <th className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={tasks.length > 0 && selectedTasks.length === tasks.length} className="w-5 h-5 accent-[#FF570A]" /></th>
                            <th className="p-4 whitespace-nowrap">Référence</th>
                            <th className="p-4">Titre</th>
                            <th className="p-4">Tag</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4">Priorité</th>
                            <th className="p-4 whitespace-nowrap">Date limite</th>
                            <th className="p-4 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="text-center p-16">Chargement...</td></tr>
                        ) : tasks.length > 0 ? tasks.map(task => (
                            <tr key={task.id} className="border-b border-[#1b263b] hover:bg-[#1C2432]">
                                <td className="p-4"><input type="checkbox" checked={selectedTasks.includes(task.id)} onChange={() => handleSelectTask(task.id)} className="w-5 h-5 accent-[#FF570A]" /></td>
                                <td className="p-4 whitespace-nowrap">{task.reference}</td>
                                <td className="p-4 font-semibold">{task.title}</td>
                                <td className="p-4"><span className="text-xs bg-gray-600 px-2 py-0.5 rounded-full">{task.tag || 'N/A'}</span></td>
                                <td className="p-4"><span className={`px-3 py-1 text-sm font-bold rounded-full text-white ${getStatusColor(task.status)}`}>{task.status}</span></td>
                                <td className={`p-4 font-bold ${getPriorityColor(task.priority)}`}>{task.priority}</td>
                                <td className="p-4 whitespace-nowrap">{task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : 'N/A'}</td>
                                <td className="p-4 flex gap-4 text-xl">
                                    <button onClick={() => navigate(`/dashboard/tasks/view/${task.id}`)} title="Voir"><i className="fas fa-eye hover:text-[#FF570A]"></i></button>
                                    <button onClick={() => navigate(`/dashboard/tasks/edit/${task.id}`)} title="Modifier"><i className="fas fa-pencil-alt hover:text-[#FF570A]"></i></button>
                                    <button onClick={() => openDeleteModal(task)} title="Supprimer"><i className="fas fa-trash-alt hover:text-red-500"></i></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={8} className="text-center p-16 text-white/70">Aucune tâche trouvée.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TasksListPage;
