import React from 'react';

interface PasswordCriteria {
    hasInput: boolean;
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
}

interface PasswordStrengthIndicatorProps {
    passwordCriteria: PasswordCriteria;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ passwordCriteria }) => {
    const { hasInput, ...criteria } = passwordCriteria;
    const criteriaMet = Object.values(criteria).filter(Boolean).length;
    
    const strengthConfig: { [key: number]: { width: string; color: string; label: string; textColor: string; } } = {
        0: { width: '0%', color: 'bg-gray-700', label: '', textColor: 'text-gray-400' },
        1: { width: '20%', color: 'bg-red-500', label: 'Très faible', textColor: 'text-red-500' },
        2: { width: '40%', color: 'bg-red-500', label: 'Faible', textColor: 'text-red-500' },
        3: { width: '60%', color: 'bg-orange-500', label: 'Moyen', textColor: 'text-orange-500' },
        4: { width: '80%', color: 'bg-yellow-500', label: 'Fort', textColor: 'text-yellow-500' },
        5: { width: '100%', color: 'bg-green-500', label: 'Très fort', textColor: 'text-green-500' },
    };
    
    if (!hasInput) return null;
    
    const { width, color, label, textColor } = strengthConfig[criteriaMet];

    return (
        <div className="w-full mt-2 text-left px-1">
            <div className="flex justify-between items-center text-xs mb-1">
                <span className={`font-semibold ${textColor}`}>
                  Force: {label}
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
                    style={{ width: width }}
                ></div>
            </div>
            <ul className="text-xs mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <li className={passwordCriteria.length ? 'text-green-400' : 'text-gray-400'}>✓ Au moins 8 caractères</li>
                <li className={passwordCriteria.uppercase ? 'text-green-400' : 'text-gray-400'}>✓ Une majuscule</li>
                <li className={passwordCriteria.lowercase ? 'text-green-400' : 'text-gray-400'}>✓ Une minuscule</li>
                <li className={passwordCriteria.number ? 'text-green-400' : 'text-gray-400'}>✓ Un chiffre</li>
                <li className={passwordCriteria.special ? 'text-green-400' : 'text-gray-400'}>✓ Un caractère spécial (@$!%*?&amp;)</li>
            </ul>
        </div>
    );
};

export default PasswordStrengthIndicator;
