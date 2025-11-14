import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// @ts-ignore
const supabase = window.supabase;

interface Project {
  id: number;
  created_at: string;
  title: string;
  status: 'En attente' | 'En cours' | 'Répondu';
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-[#121926] rounded-lg shadow-xl w-full max-w-md border border-[#1b263b]">
                <div className="p-4 border-b border-[#1b263b]"><h3 className="text-lg font-bold">{title}</h3></div>
                <div className="p-6"><p>{message}</p></div>
                <div className="p-4 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 font-bold rounded hover:bg-gray-600">Annuler</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 font-bold rounded hover:bg-red-500">Supprimer</button>
                </div>
            </div>
        </div>
    );
};

const getStatusBadge = (status: Project['status']) => {
    const styles = {
        'En attente': 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
        'En cours': 'bg-blue-500/20 text-blue-300 border-blue-500',
        'Répondu': 'bg-green-500/20 text-green-300 border-green-500',
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${styles[status] || 'bg-gray-500/20 text-gray-300 border-gray-500'}`}>
            {status}
        </span>
    );
};

const ProjectsListPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('id, created_at, title, status').order('created_at', { ascending: false });
        if (error) console.error("Error fetching projects:", error.message);
        else setProjects(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const openDeleteModal = (project: Project) => {
        setProjectToDelete(project);
        setIsModalOpen(true);
    };
    
    const handleDelete = async () => {
        if (!projectToDelete) return;
        const { error } = await supabase.from('projects').delete().match({ id: projectToDelete.id });
        if (error) console.error("Error deleting project:", error.message);
        setIsModalOpen(false);
        setProjectToDelete(null);
        fetchProjects();
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title={`Supprimer le projet : ${projectToDelete?.title}`}
                message="Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible."
            />
            
            <header className="flex justify-between items-center p-4">
                <h1 className="text-[23px] font-bold">Mes Projets</h1>
                <Link to="/dashboard/projects/new" className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">
                    Soumettre un nouveau projet
                </Link>
            </header>

            <div className="overflow-x-auto bg-[#121926]">
                <table className="w-full min-w-max text-left text-[16px]">
                    <thead className="bg-[#141922]">
                        <tr className="border-b border-[#1b263b]">
                            <th className="p-4">Titre du Projet</th>
                            <th className="p-4 whitespace-nowrap">Date de création</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center p-16">Chargement des projets...</td></tr>
                        ) : projects.length > 0 ? projects.map(project => (
                            <tr key={project.id} className="border-b border-[#1b263b] hover:bg-[#1C2432]">
                                <td className="p-4 font-semibold">{project.title}</td>
                                <td className="p-4 whitespace-nowrap">{new Date(project.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td className="p-4">{getStatusBadge(project.status)}</td>
                                <td className="p-4 flex gap-4 text-xl">
                                    <button onClick={() => navigate(`/dashboard/projects/view/${project.id}`)} title="Voir les détails"><i className="fas fa-eye hover:text-[#FF570A]"></i></button>
                                    <button onClick={() => openDeleteModal(project)} title="Supprimer"><i className="fas fa-trash-alt hover:text-red-500"></i></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center p-16 text-white/70">Vous n'avez soumis aucun projet pour le moment.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsListPage;