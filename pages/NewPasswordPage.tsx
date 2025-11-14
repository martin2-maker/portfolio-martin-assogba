import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createNotification } from '../lib/notifications';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

// @ts-ignore
const supabase = window.supabase;

type PageStatus = 'CHECKING' | 'READY' | 'SUCCESS' | 'ERROR';

const NewPasswordPage = () => {
  const [status, setStatus] = useState<PageStatus>('CHECKING');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    hasInput: false,
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  /**
   * Vérifie si l’URL contient bien un token recovery valide.
   * Supabase ne déclenche pas toujours PASSWORD_RECOVERY selon les versions,
   * donc on vérifie manuellement.
   */
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    const accessToken = hashParams.get("access_token");

    if (type === "recovery" && accessToken) {
      setStatus("READY");
    } else {
      setError("Ce lien de réinitialisation est invalide ou a expiré.");
      setStatus("ERROR");
    }
  }, []);

  /**
   * Vérification dynamique des critères du mot de passe
   */
  useEffect(() => {
    setPasswordCriteria({
      hasInput: newPassword.length > 0,
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[@$!%*?&]/.test(newPassword),
    });
  }, [newPassword]);

  /**
   * Envoi du nouveau mot de passe
   */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { hasInput, ...criteria } = passwordCriteria;
    const allCriteriaMet = Object.values(criteria).every(Boolean);

    if (!allCriteriaMet) {
      setError("Le mot de passe ne respecte pas toutes les exigences de sécurité.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setError(updateError.message || "Une erreur est survenue lors de la mise à jour.");
      setStatus('ERROR');
    } else {
      await createNotification('PASSWORD_RESET', {});
      await supabase.auth.signOut(); // sécurité obligatoire
      setStatus('SUCCESS');
    }

    setIsSubmitting(false);
  };

  /**
   * Rendu conditionnel
   */
  const renderContent = () => {
    if (status === 'CHECKING') {
      return (
        <div className="reset-password-container text-center">
          <p className="text-base text-gray-400">Vérification du lien de réinitialisation...</p>
        </div>
      );
    }

    if (status === 'SUCCESS') {
      return (
        <div className="reset-password-container text-center">
          <h1 className="text-2xl font-bold text-green-500 mb-4">✅ Mot de passe mis à jour !</h1>
          <p className="text-base text-gray-400 mb-8">
            Votre mot de passe a été modifié avec succès. Vous pouvez désormais vous connecter avec vos nouvelles informations.
          </p>
          <Link to="/compte" className="text-[#007BFF] text-sm mt-6 inline-block hover:underline font-bold">
            Aller à la page de connexion →
          </Link>
        </div>
      );
    }

    if (status === 'ERROR') {
      return (
        <div className="reset-password-container text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Lien invalide</h1>
          <p className="text-base text-gray-400 mb-8">{error}</p>
          <Link to="/reset-password" className="text-[#007BFF] text-sm mt-6 inline-block hover:underline">
            ← Demander un nouveau lien
          </Link>
        </div>
      );
    }

    return (
      <div className="reset-password-container">
        <h1 className="text-2xl font-bold mb-2">Définir un nouveau mot de passe</h1>
        <p className="text-base text-gray-400 mb-8">
          Veuillez saisir votre nouveau mot de passe pour sécuriser votre compte.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-left text-sm mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
            <PasswordStrengthIndicator passwordCriteria={passwordCriteria} />
          </div>

          <div className="pt-4">
            <label className="block text-left text-sm mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full !mt-8"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121926] to-[#1E2A38] flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};

export default NewPasswordPage;
