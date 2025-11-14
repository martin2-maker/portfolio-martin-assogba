import { useState, useEffect, useRef } from 'react';

const WordCounterPage = () => {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStatusText, setAnalysisStatusText] = useState('Analyse en cours');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        readingMinutes: '0.00'
    });
    
    // Using a ref to avoid stale closure issues in setInterval
    const analysisTimeoutRef = useRef<number | null>(null);

    const updateStats = (currentText: string) => {
        const trimmedText = currentText.trim();
        const words = trimmedText.length ? trimmedText.split(/\s+/).filter(w => w.length > 0).length : 0;
        const chars = trimmedText.length;
        const charsNoSpace = trimmedText.replace(/\s+/g, '').length;
        const sentences = trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = trimmedText.split(/\n+/).filter(p => p.trim().length > 0).length;
        const readingMinutes = words > 0 ? (words / 200).toFixed(2) : '0.00';

        setStats({
            words,
            chars,
            charsNoSpace,
            sentences,
            paragraphs,
            readingMinutes
        });
    };

    const startAnalysisAnimation = (callback: () => void) => {
        if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
        
        setIsAnalyzing(true);
        
        let dots = 0;
        const interval = setInterval(() => {
            dots = (dots + 1) % 4;
            setAnalysisStatusText("Analyse en cours" + ".".repeat(dots));
        }, 500);

        const duration = Math.floor(Math.random() * 500) + 500; // Shorter duration for better UX

        analysisTimeoutRef.current = window.setTimeout(() => {
            clearInterval(interval);
            setIsAnalyzing(false);
            callback();
        }, duration);
    };
    
    // This effect runs when text changes. It triggers the analysis.
    useEffect(() => {
        startAnalysisAnimation(() => updateStats(text));
        
        return () => {
            // Cleanup timeout if component unmounts during analysis
            if (analysisTimeoutRef.current) {
                clearTimeout(analysisTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
        } catch (err) {
            alert("Impossible d'accéder au presse-papiers.");
        }
    };
    
    const handleClear = () => {
        setText('');
    };

    const getBarWidth = (value: number, max: number) => {
        return Math.min(100, (value / max) * 100) + '%';
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">Compteur de Mots Premium</h1>
            </header>
            
            <div className="word-counter-container">
                {isAnalyzing && <div className="analysis-status">{analysisStatusText}</div>}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Collez votre texte ici..."
                ></textarea>
                
                <div className="stats">
                    <div className="stat-box">
                        <h2>{stats.words}</h2>
                        <p>Mots</p>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: getBarWidth(stats.words, 500) }}></div></div>
                    </div>
                    <div className="stat-box">
                        <h2>{stats.chars}</h2>
                        <p>Caractères</p>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: getBarWidth(stats.chars, 3000) }}></div></div>
                    </div>
                    <div className="stat-box">
                        <h2>{stats.charsNoSpace}</h2>
                        <p>Caractères sans espaces</p>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: getBarWidth(stats.charsNoSpace, 2500) }}></div></div>
                    </div>
                </div>
                
                <div className="stats-row">
                    <div className="stat-box">
                        <h2>{stats.sentences}</h2>
                        <p>Phrases</p>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: getBarWidth(stats.sentences, 50) }}></div></div>
                    </div>
                    <div className="stat-box">
                        <h2>{stats.paragraphs}</h2>
                        <p>Paragraphes</p>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: getBarWidth(stats.paragraphs, 20) }}></div></div>
                    </div>
                    <div className="stat-box">
                        <h2>{stats.readingMinutes} min</h2>
                        <p>Temps de lecture</p>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: getBarWidth(parseFloat(stats.readingMinutes), 10) }}></div></div>
                    </div>
                </div>
                
                <button onClick={handlePaste}>Coller depuis le presse-papier</button>
                <button onClick={handleClear} className="clear-btn">Effacer</button>
            </div>
        </div>
    );
};
export default WordCounterPage;