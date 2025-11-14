import React from 'react';

const FileIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "text-4xl" }) => {
    const baseClass = "fas";
    if (type.startsWith('image/')) return <i className={`${baseClass} fa-file-image ${className} text-blue-400`}></i>;
    if (type === 'application/pdf') return <i className={`${baseClass} fa-file-pdf ${className} text-red-400`}></i>;
    if (type.includes('word')) return <i className={`${baseClass} fa-file-word ${className} text-blue-500`}></i>;
    if (type.includes('document')) return <i className={`${baseClass} fa-file-word ${className} text-blue-500`}></i>;
    return <i className={`${baseClass} fa-file-alt ${className} text-gray-400`}></i>;
};

export default FileIcon;
