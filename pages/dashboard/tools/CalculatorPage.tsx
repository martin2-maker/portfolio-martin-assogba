import { useState } from 'react';

const CalculatorPage = () => {
    const [display, setDisplay] = useState('');
    const [history, setHistory] = useState('');

    const handleInput = (value: string) => {
        setDisplay(prev => prev + value);
    };

    const clearDisplay = () => {
        setDisplay('');
        setHistory('');
    };

    const backspace = () => {
        setDisplay(prev => prev.slice(0, -1));
    };

    const calculate = () => {
        if (!display) return;
        try {
            let expression = display
                .replace(/%/g, '/100')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/\^/g, '**')
                .replace(/÷/g, '/')
                .replace(/×/g, '*');

            // eslint-disable-next-line no-new-func
            const result = new Function('return ' + expression)();
            
            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid calculation");
            }
            
            setHistory(display + ' =');
            setDisplay(String(result));
        } catch (error) {
            setHistory(display + ' =');
            setDisplay('Erreur');
        }
    };

    const buttons = [
        { label: 'sin', action: () => handleInput('sin(') },
        { label: 'cos', action: () => handleInput('cos(') },
        { label: 'tan', action: () => handleInput('tan(') },
        { label: 'log', action: () => handleInput('log(') },
        { label: 'ln', action: () => handleInput('ln(') },

        { label: '(', action: () => handleInput('(') },
        { label: ')', action: () => handleInput(')') },
        { label: '√', action: () => handleInput('sqrt(') },
        { label: 'xʸ', action: () => handleInput('^') },
        { label: '%', action: () => handleInput('%') },

        { label: '7', action: () => handleInput('7') },
        { label: '8', action: () => handleInput('8') },
        { label: '9', action: () => handleInput('9') },
        { label: '÷', action: () => handleInput('÷') },
        { label: 'C', action: clearDisplay, style: 'bg-red-600 hover:bg-red-500' },
        
        { label: '4', action: () => handleInput('4') },
        { label: '5', action: () => handleInput('5') },
        { label: '6', action: () => handleInput('6') },
        { label: '×', action: () => handleInput('×') },
        { label: '⌫', action: backspace, style: 'bg-orange-600 hover:bg-orange-500' },

        { label: '1', action: () => handleInput('1') },
        { label: '2', action: () => handleInput('2') },
        { label: '3', action: () => handleInput('3') },
        { label: '-', action: () => handleInput('-') },
        { label: '+', action: () => handleInput('+'), style: 'row-span-2' },

        { label: 'π', action: () => handleInput('π') },
        { label: 'e', action: () => handleInput('e') },
        { label: '0', action: () => handleInput('0') },
        { label: '.', action: () => handleInput('.') },
        
        { label: '=', action: calculate, style: 'col-span-5 bg-green-600 hover:bg-green-500 text-2xl' },
    ];

    return (
        <div className="font-sans-fallback text-white space-y-6 bg-[#121926]">
            <header className="flex justify-between items-center bg-[#121926] p-4">
                <h1 className="text-[23px] font-bold">Calculatrice Scientifique</h1>
            </header>
            <div className="flex justify-center items-center">
                <div className="w-4/5 max-w-2xl bg-[#1b263b] p-5 rounded-2xl shadow-lg border border-white/10">
                    <div className="w-full h-24 bg-[#121926] rounded-lg mb-4 p-4 text-right overflow-hidden">
                        <div className="text-gray-400 text-lg h-6 truncate">{history}</div>
                        <input
                            type="text"
                            value={display}
                            readOnly
                            className="w-full bg-transparent text-white text-4xl font-bold border-none outline-none text-right"
                        />
                    </div>
                    <div className="grid grid-cols-5 grid-rows-7 gap-3">
                        {buttons.map((btn, index) => (
                            <button
                                key={index}
                                onClick={btn.action}
                                className={`
                                    p-3 rounded-lg text-xl font-semibold transition-transform transform active:scale-95 
                                    ${btn.style ? btn.style : 'bg-[#121926] hover:bg-[#FF570A]'}
                                `}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;