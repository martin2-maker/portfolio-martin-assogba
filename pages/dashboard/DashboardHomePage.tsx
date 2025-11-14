import React, { useState, useEffect, useCallback } from 'react';

// @ts-ignore
const supabase = window.supabase;

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-[#1b263b] p-6 rounded-lg border border-white/10 flex items-center gap-4">
        <i className={`fas ${icon} text-3xl text-[#FF570A]`}></i>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const DashboardHomePage = () => {
    const [stats, setStats] = useState({ tasks: 0, notes: 0, projects: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
        const { count: notesCount } = await supabase.from('notes').select('*', { count: 'exact', head: true });
        const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });

        setStats({ tasks: tasksCount || 0, notes: notesCount || 0, projects: projectsCount || 0 });
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchStats();

        const channel = supabase.channel('dashboard-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchStats)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, fetchStats)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchStats)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchStats]);

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold mb-4">Statistiques globales</h2>
                {loading ? <p>Chargement des statistiques...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Nombre de tâches" value={stats.tasks} icon="fa-tasks" />
                        <StatCard title="Nombre de notes" value={stats.notes} icon="fa-sticky-note" />
                        <StatCard title="Projets soumis" value={stats.projects} icon="fa-project-diagram" />
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardHomePage;