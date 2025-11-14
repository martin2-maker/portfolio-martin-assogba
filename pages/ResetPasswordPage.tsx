import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';

// @ts-ignore
const supabase = window.supabase;

const Toast = ({ message, type, isVisible }: { message: string, type: 'success' | 'error', isVisible: boolean }) => {
  if (!isVisible) return null;
  return (
    <div 
      className="fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 text-white font-semibold"
      style={{ backgroundColor: type === 'success' ? '#198754' : '#dc3545' }}
    >
      {message}
    </div>
  );
};

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error', isVisible: boolean }>({ message: '', type: 'success', isVisible: false });
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: number;
    if (resendCooldown > 0) {
      timer = window.setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast({ message: '', type, isVisible: false }), 4000);
  };

  const handlePasswordReset = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${window.location.pathname}#/new-password`
      });

      if (error) {
        showToast('❌ Impossible d’envoyer le lien. Vérifiez votre email.', 'error');
      } else {
        console.log('Token généré par Supabase :', data); // Pour debug, contient info sur le token
        setFormSubmitted(true);
        setResendCooldown(60);
      }
    } catch (err) {
      showToast('❌ Une erreur est survenue. Réessayez.', 'error');
      console.error(err);
    }

    setLoading(false);
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121926] to-[#1E2A38] flex items-center justify-center p-4">
        <div className="reset-password-container">
          <h2 className="text-2xl font-bold mb-4">Vérifiez votre boîte mail</h2>
          <p className="text-base text-gray-400 mb-6">
            Si nous trouvons un compte éligible associé à cette adresse, nous enverrons un courriel contenant un lien pour réinitialiser votre mot de passe.
          </p>
          <button 
            onClick={() => {
              if (resendCooldown === 0) handlePasswordReset();
            }}
            disabled={resendCooldown > 0}
            className="w-full"
          >
            {resendCooldown > 0 ? `Renvoyer le lien dans ${resendCooldown}s` : 'Renvoyer le lien'}
          </button>
          <Link to="/compte" className="text-[#007BFF] text-sm mt-6 inline-block hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121926] to-[#1E2A38] flex items-center justify-center p-4">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />
      <div className="reset-password-container">
        <h2 className="text-2xl font-bold mb-2">Réinitialiser votre mot de passe</h2>
        <p className="text-base text-gray-400 mb-8">Entrez votre email pour recevoir un lien de réinitialisation.</p>
        <form id="reset-password-form" onSubmit={handlePasswordReset}>
          <input 
            type="email" 
            id="email"
            placeholder="exemple@email.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>
        <Link to="/compte" className="text-[#007BFF] text-sm mt-6 inline-block hover:underline">
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
