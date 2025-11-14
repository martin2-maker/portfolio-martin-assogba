import { getClientInfo } from './clientInfo';

// @ts-ignore
const supabase = window.supabase;

// This function uses an API token on the client-side.
// In a production environment, this should be handled by a secure backend service or an edge function
// to avoid exposing the token.
const fetchIPInfo = async () => {
  try {
    // WARNING: The hardcoded token was invalid and causing fetch failures.
    // Using the token-less endpoint is more reliable for this use case.
    const url = `https://ipinfo.io/json`;
    const response = await fetch(url);
    if (!response.ok) return { ip: 'N/A', city: 'N/A', country: 'N/A' };
    const data = await response.json();
    return { ip: data.ip, city: data.city, country: data.country };
  } catch (error) {
    console.error("Failed to fetch IP info:", error);
    return { ip: 'N/A', city: 'N/A', country: 'N/A' };
  }
};

const formatDateTime = (date: Date) => {
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const createNotification = async (type: string, metadata: any) => {
    // @ts-ignore
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const authorName = user.user_metadata.full_name || user.email;
    let message = '';
    let icon = '';
    let color = '';
    const formattedTime = formatDateTime(new Date());

    const createAuthMessage = async (actionText: string) => {
        const ipInfo = await fetchIPInfo();
        const clientInfo = await getClientInfo();
        const browserInfo = clientInfo.browser.name ? `${clientInfo.browser.name} ${clientInfo.browser.version || ''}`.trim() : 'Navigateur inconnu';
        const osInfo = clientInfo.os || 'OS inconnu';
        
        return `${actionText} par ${authorName} depuis ${ipInfo.city}, ${ipInfo.country} (${ipInfo.ip}).\n` +
               `Appareil : ${browserInfo} sur ${osInfo}.\n` +
               `Date : ${formattedTime}.`;
    };

    switch (type) {
        case 'NOTE_CREATED':
            message = `Votre note "${metadata.title}" a été créée avec succès le ${formattedTime}.`;
            icon = '✅';
            color = '#FF570A';
            break;
        case 'NOTE_MODIFIED':
            message = `La note "${metadata.title}" a été mise à jour avec succès le ${formattedTime}.`;
            icon = '✏️';
            color = '#FF570A';
            break;
        case 'NOTE_DELETED':
            message = `La note "${metadata.title}" a été supprimée le ${formattedTime}. Cette action est irréversible.`;
            icon = '⚠️';
            color = '#D80536';
            break;
        case 'TASK_CREATED':
            message = `Tâche ‘${metadata.title}’ ajoutée par ${authorName} le ${formattedTime}.`;
            icon = '✅';
            color = '#198754';
            break;
        case 'TASK_MODIFIED':
            message = `Tâche ‘${metadata.title}’ mise à jour par ${authorName} le ${formattedTime}.`;
            icon = '✏️';
            color = '#FF570A';
            break;
        case 'TASK_DELETED':
            message = `Tâche ‘${metadata.title}’ supprimée par ${authorName} le ${formattedTime}.`;
            icon = '🗑️';
            color = '#D80536';
            break;
        case 'PROJECT_SUBMITTED':
            message = `Votre projet "${metadata.title}" a bien été soumis pour audit. Vous recevrez une réponse prochainement.`;
            icon = '🚀';
            color = '#4EA8FF';
            break;
        case 'PROJECT_STATUS_UPDATED':
            message = `Le statut de votre projet "${metadata.title}" est passé à "${metadata.status}".`;
            icon = '🔄';
            color = '#FFC107';
            break;
        case 'USER_SIGNUP':
            message = await createAuthMessage('Nouvelle inscription');
            icon = '🎉';
            color = '#198754';
            break;
        case 'USER_LOGIN':
            message = await createAuthMessage('Connexion réussie');
            icon = '🔑';
            color = '#4EA8FF';
            break;
        case 'PASSWORD_RESET':
            message = await createAuthMessage('Mot de passe réinitialisé');
            icon = '🔒';
            color = '#198754';
            break;
        default:
            return;
    }

    // @ts-ignore
    const { error } = await supabase.from('notifications').insert([{
        user_id: user.id,
        type: type,
        message: message,
        icon: icon,
        color: color,
        is_read: false
    }]);

    if (error) {
        console.error('Error creating notification:', error.message || error);
    }
};