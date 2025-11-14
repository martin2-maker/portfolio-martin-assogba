import { useState } from 'react';

// Déclare la variable XLSX pour utiliser la bibliothèque chargée via CDN dans index.html
declare const XLSX: any;

const EmailExtractorPage = () => {
    const [inputText, setInputText] = useState('');
    const [extractedEmails, setExtractedEmails] = useState<string[]>([]);
    const [copyButtonText, setCopyButtonText] = useState('Copier tout');

    const handleExtract = () => {
        const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi;
        const matches = inputText.match(regex);
        if (matches) {
            const uniqueEmails = [...new Set(matches)];
            setExtractedEmails(uniqueEmails);
        } else {
            setExtractedEmails([]);
        }
    };

    const handleCopy = () => {
        if (extractedEmails.length > 0) {
            navigator.clipboard.writeText(extractedEmails.join('\n')).then(() => {
                setCopyButtonText('✅ Copié !');
                setTimeout(() => setCopyButtonText('Copier tout'), 2000);
            });
        }
    };

    const handleExport = () => {
        if (extractedEmails.length > 0) {
            const worksheetData = [
                ["Liste des adresses e-mail"],
                ...extractedEmails.map(email => [email])
            ];
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");
            XLSX.writeFile(workbook, "emails_extraits.xlsx");
        }
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">📧 Extracteur d’adresses e-mail</h1>
            </header>

            <div className="max-w-4xl mx-auto bg-[#1b263b] p-6 rounded-lg border border-white/10">
                <p className="text-gray-300 mb-4">
                    Collez votre texte brut dans le champ ci-dessous, puis cliquez sur "Extraire" pour détecter et lister toutes les adresses e-mail uniques.
                </p>
                <textarea
                    id="inputText"
                    className="w-full h-48 bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none resize-y"
                    placeholder="Collez ici un long texte, une liste de contacts, ou le code source d'une page..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="mt-4">
                    <button
                        id="extractBtn"
                        onClick={handleExtract}
                        className="px-6 py-2 bg-[#FF570A] text-white font-bold rounded hover:bg-opacity-80 transition-colors"
                    >
                        Extraire les e-mails
                    </button>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-2">Résultats</h2>
                    <div id="output" className="p-4 bg-[#121926] rounded-lg min-h-[100px] max-h-80 overflow-y-auto">
                        {extractedEmails.length > 0 ? (
                            <>
                                <p className="font-bold mb-3">{extractedEmails.length} adresse(s) unique(s) trouvée(s) :</p>
                                <ul className="space-y-1 list-none p-0">
                                    {extractedEmails.map((mail, index) => (
                                        <li key={index} className="text-gray-300">
                                            <i className="fas fa-envelope mr-2 text-[#FF570A]"></i>{mail}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 flex gap-4">
                                    <button onClick={handleCopy} className="px-4 py-2 bg-transparent border border-[#FF570A] text-[#FF570A] font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors text-sm">
                                        {copyButtonText}
                                    </button>
                                    <button onClick={handleExport} className="px-4 py-2 bg-transparent border border-[#FF570A] text-[#FF570A] font-bold rounded hover:bg-[#FF570A] hover:text-[#121926] transition-colors text-sm">
                                        <i className="fas fa-file-excel mr-2"></i>Télécharger (.xlsx)
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400 italic">Aucune adresse e-mail trouvée ou texte non analysé.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EmailExtractorPage;