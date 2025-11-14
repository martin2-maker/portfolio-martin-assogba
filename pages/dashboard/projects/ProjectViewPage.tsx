import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FileIcon from '../../../components/FileIcon';

// @ts-ignore
const supabase = window.supabase;

interface Project {
    id: number;
    created_at: string;
    title: string;
    description: string;
    status: 'En attente' | 'En cours' | 'Répondu';
    attachments: { name: string; url: string; type: string }[];
}

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

const ProjectViewPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProject = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) {
            navigate('/dashboard/projects');
        } else {
            setProject(data);
        }
        setLoading(false);
    }, [projectId, navigate]);

    useEffect(() => { 
        fetchProject();
        
        const channel = supabase
            .channel(`project-view-${projectId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` }, fetchProject)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchProject, projectId]);

    if (loading) return <div className="text-center p-10">Chargement du projet...</div>;
    if (!project) return <div className="text-center p-10">Projet non trouvé.</div>;

    return (
        <div className="font-sans-fallback text-white space-y-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-xl md:text-2xl font-bold">Détails du projet</h1>
                <button onClick={() => navigate('/dashboard/projects')} className="px-4 py-2 bg-gray-700 font-bold rounded hover:bg-gray-600">
                    Retour à la liste
                </button>
            </header>
            
            <div className="space-y-6 bg-[#1b263b] p-4 md:p-8 rounded-lg border border-white/10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-[28px] font-bold text-white">{project.title}</h2>
                        <p className="text-[#BFC9D9]">Soumis le {new Date(project.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {getStatusBadge(project.status)}
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-2 border-t border-white/10 pt-6">Description</h3>
                    <p className="text-white/80 whitespace-pre-wrap">{project.description}</p>
                </div>

                {project.attachments && project.attachments.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-4 border-t border-white/10 pt-6">Pièces jointes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {project.attachments.map((file, index) => (
                                <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="block border border-[#121926] bg-[#121926] rounded-lg p-4 text-center hover:border-[#FF570A] transition-colors">
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

export default ProjectViewPage;