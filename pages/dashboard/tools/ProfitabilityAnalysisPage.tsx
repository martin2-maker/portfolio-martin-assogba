import React, { useState, FormEvent } from 'react';

interface Results {
    benefice: string;
    marge_brute: string;
    seuil: string;
    rentabilite: string;
    roi: string;
    analyse: string;
}

const ProfitabilityAnalysisPage = () => {
    const [inputs, setInputs] = useState({
        revenus: '',
        couts_fixes: '',
        couts_variables: '',
        investissement: '',
        duree: ''
    });
    const [results, setResults] = useState<Results | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleCalculate = (e: FormEvent) => {
        e.preventDefault();

        const revenus = parseFloat(inputs.revenus) || 0;
        const couts_fixes = parseFloat(inputs.couts_fixes) || 0;
        const couts_variables_percent = parseFloat(inputs.couts_variables) || 0;
        const investissement = parseFloat(inputs.investissement) || 0;
        const duree = parseFloat(inputs.duree) || 0;

        if (revenus <= 0) {
            // Peut-être afficher une erreur
            return;
        }

        const coutsVarMensuels = revenus * (couts_variables_percent / 100);
        const beneficeMensuel = revenus - (couts_fixes + coutsVarMensuels);
        const margeBrute = ((revenus - coutsVarMensuels) / revenus) * 100;
        const seuilRentabilite = couts_fixes / (1 - (couts_variables_percent / 100));
        const rentabiliteTotale = beneficeMensuel * duree - investissement;
        const roi = investissement > 0 ? (rentabiliteTotale / investissement) * 100 : Infinity;

        let analyse = "";
        if (roi > 50) analyse = "🚀 Excellent rendement ! Le projet est très rentable.";
        else if (roi > 20) analyse = "✅ Rentabilité satisfaisante. Le projet génère un bon retour.";
        else if (roi > 0) analyse = "⚠️ Rentabilité faible. Il est conseillé d'optimiser les coûts ou d'augmenter les revenus.";
        else analyse = "❌ Non rentable pour le moment. Le projet perd de l'argent sur la période analysée.";
        
        if (seuilRentabilite > revenus) {
            analyse += " Attention, votre chiffre d'affaires est inférieur au seuil de rentabilité."
        }


        setResults({
            benefice: beneficeMensuel.toFixed(2),
            marge_brute: margeBrute.toFixed(2),
            seuil: seuilRentabilite.toFixed(2),
            rentabilite: rentabiliteTotale.toFixed(2),
            roi: isFinite(roi) ? roi.toFixed(2) : "N/A",
            analyse: analyse,
        });
    };

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">📊 Outil de Trésorerie & Rentabilité</h1>
            </header>

            <div className="max-w-4xl mx-auto bg-[#1b263b] p-6 rounded-lg border border-white/10">
                <form id="calcForm" onSubmit={handleCalculate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="revenus" className="text-sm text-gray-400">💸 Chiffre d'affaires mensuel (€)</label>
                            <input type="number" id="revenus" value={inputs.revenus} onChange={handleInputChange} placeholder="Ex: 10000" required className="w-full mt-2 bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                        </div>
                        <div>
                            <label htmlFor="couts_fixes" className="text-sm text-gray-400">🏢 Coûts fixes mensuels (€)</label>
                            <input type="number" id="couts_fixes" value={inputs.couts_fixes} onChange={handleInputChange} placeholder="Ex: 2000" required className="w-full mt-2 bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                        </div>
                        <div>
                            <label htmlFor="couts_variables" className="text-sm text-gray-400">⚙️ Coûts variables (en % du CA)</label>
                            <input type="number" id="couts_variables" value={inputs.couts_variables} onChange={handleInputChange} placeholder="Ex: 30" required className="w-full mt-2 bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                        </div>
                        <div>
                            <label htmlFor="investissement" className="text-sm text-gray-400">💰 Investissement initial (€)</label>
                            <input type="number" id="investissement" value={inputs.investissement} onChange={handleInputChange} placeholder="Ex: 5000" required className="w-full mt-2 bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="duree" className="text-sm text-gray-400">📆 Durée de l’analyse (en mois)</label>
                            <input type="number" id="duree" value={inputs.duree} onChange={handleInputChange} placeholder="Ex: 12" required className="w-full mt-2 bg-[#121926] p-3 rounded border border-transparent focus:border-[#FF570A] outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="w-full mt-6 px-6 py-3 bg-[#FF570A] text-white font-bold rounded hover:bg-opacity-80 transition-colors">
                        Calculer la rentabilité
                    </button>
                </form>

                {results && (
                    <div id="results" className="mt-8 p-6 bg-[#121926] rounded-lg">
                        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">📈 Résultats de l’analyse</h2>
                        <div className="space-y-3 text-base">
                            <p>Bénéfice net mensuel : <span className="text-[#FF570A] font-bold">{results.benefice} €</span></p>
                            <p>Marge brute : <span className="text-[#FF570A] font-bold">{results.marge_brute} %</span></p>
                            <p>Seuil de rentabilité (CA minimum pour être à l'équilibre) : <span className="text-[#FF570A] font-bold">{results.seuil} €</span></p>
                            <p>Rentabilité totale sur {inputs.duree} mois (après investissement) : <span className="text-[#FF570A] font-bold">{results.rentabilite} €</span></p>
                            <p>ROI (Retour sur Investissement) : <span className="text-[#FF570A] font-bold">{results.roi} %</span></p>
                            <p className="border-t border-white/10 pt-3 mt-3">Analyse globale : <span className="text-[#FF570A] font-semibold">{results.analyse}</span></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfitabilityAnalysisPage;