import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// @ts-ignore
const supabase = window.supabase;

interface Note {
    id: number;
    reference: string;
    created_at: string;
    author: string;
    title: string;
    tag: string;
    cover_url: string;
    content: string;
    attachments: { name: string; url: string; type: string }[];
}


const NoteViewPage = () => {
    const navigate = useNavigate();
    const { noteId } = useParams();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchNote = useCallback(async () => {
        if (!noteId) return;
        setLoading(true);
        const { data, error } = await supabase.from('notes').select('*').eq('id', noteId).single();
        if (error) {
            console.error(error);
            navigate('/dashboard/notes');
        } else {
            setNote(data);
        }
        setLoading(false);
    }, [noteId, navigate]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    if (loading) {
        return <div className="text-center p-10">Chargement de la note...</div>
    }

    if (!note) {
        return <div className="text-center p-10">Note non trouvée.</div>
    }

    return (
        <div className="font-sans-fallback text-white space-y-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-xl md:text-2xl font-bold">Prévisualiser la note : {note.reference}</h1>
                <button onClick={() => navigate('/dashboard/notes')} className="px-4 py-2 bg-[#121926] border border-[#FF570A] text-white font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors">
                    Retour à la liste
                </button>
            </header>
            
            <div className="bg-[#121926] rounded-lg border border-[#1b263b] overflow-hidden">
                {note.cover_url && (
                    <div className="h-48 md:h-64 bg-cover bg-center" style={{ backgroundImage: `url(${note.cover_url})` }}>
                    </div>
                )}

                <div className="p-4 md:p-8 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-[28px] font-bold text-white">{note.title}</h2>
                        <div className="flex items-center gap-4 text-[#BFC9D9] flex-wrap">
                            <span>{new Date(note.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span>|</span>
                            <span>Par {note.author}</span>
                            <span>|</span>
                            <span className="bg-[#FF570A] text-[#121926] px-2 py-1 rounded text-sm font-bold">{note.tag}</span>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-white text-[18px] border-t border-[#1b263b] pt-6" dangerouslySetInnerHTML={{ __html: note.content || '' }}></div>

                    {note.attachments && note.attachments.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 border-t border-[#1b263b] pt-6">Fichiers attachés</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {note.attachments.map((file, index) => (
                                    <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="block border border-[#1b263b] rounded-lg p-2 text-center hover:border-[#FF570A] transition-colors">
                                        {file.type.startsWith('image/') ? (
                                            <img src={file.url} alt={file.name} className="w-full h-24 object-cover rounded mb-2" />
                                        ) : (
                                            <div className="h-24 flex items-center justify-center text-gray-400">
                                                 <i className="fas fa-file-alt text-4xl"></i>
                                            </div>
                                        )}
                                        <span className="text-sm truncate block">{file.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteViewPage;