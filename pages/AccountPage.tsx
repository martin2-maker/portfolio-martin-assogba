import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createNotification } from '../lib/notifications';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const AccountPage = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    hasInput: false,
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  // Feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  
  // Manages user session and redirection
  useEffect(() => {
    // First, check if there's already a session on page load
    const checkInitialSession = async () => {
      // @ts-ignore
      const { data: { session } } = await window.supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkInitialSession();

    // Then, listen for auth state changes (e.g., after sign in, or after email verification link is clicked)
    // @ts-ignore
    const { data: { subscription } } = window.supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // A session has been established, redirect to the dashboard.
        // Add a small delay to allow success messages to be seen briefly.
        setTimeout(() => navigate('/dashboard', { replace: true }), 500);
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  // Check for custom email verification message on URL
  useEffect(() => {
    const hash = location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      if (params.get("verified") === "true") {
        setVerificationMessage("Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.");
        // Clean URL by removing the query parameter
        navigate('/compte', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    const checkPassword = () => {
      const hasInput = password.length > 0;
      const length = password.length >= 8;
      const uppercase = /[A-Z]/.test(password);
      const lowercase = /[a-z]/.test(password);
      const number = /[0-9]/.test(password);
      const special = /[@$!%*?&]/.test(password);
      setPasswordCriteria({ hasInput, length, uppercase, lowercase, number, special });
    };
    checkPassword();
  }, [password]);

  const clearFormState = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTermsAccepted(false);
    setPasswordCriteria({ hasInput: false, length: false, uppercase: false, lowercase: false, number: false, special: false });
    setError(null);
    setSuccessMessage(null);
    setRegistrationSuccess(false);
  };

  const handleToggle = (activeState: boolean) => {
    setIsActive(activeState);
    clearFormState();
    setVerificationMessage(null); // Clear verification message on form toggle
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { hasInput, ...criteria } = passwordCriteria;
    const allCriteriaMet = Object.values(criteria).every(Boolean);

    if (!allCriteriaMet) {
      setError("Le mot de passe ne respecte pas toutes les exigences de sécurité.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError("Vous devez accepter les conditions d'utilisation et la politique de confidentialité.");
      setLoading(false);
      return;
    }

    try {
      // @ts-ignore
      const { data, error } = await window.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/#/compte?verified=true`,
        },
      });

      if (error) throw error;
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou vérifier vos e-mails pour confirmer.");
      } else {
        setRegistrationSuccess(true);
      }
      
    } catch (err: any) {
      let frenchError = "Une erreur est survenue lors de l'inscription.";
      if (err.message && err.message.includes("User already registered")) {
        frenchError = "Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou vérifier vos e-mails pour confirmer.";
      }
      setError(frenchError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // @ts-ignore
      const { data, error } = await window.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user?.user_metadata?.deactivated) {
        // @ts-ignore
        await window.supabase.auth.signOut();
        setError("Ce compte a été supprimé. Veuillez créer un nouveau compte si vous souhaitez revenir.");
        setLoading(false);
        return;
      }
      
      await createNotification('USER_LOGIN', {});
      
      setSuccessMessage("Connexion réussie ! Redirection...");
      // Redirection is handled by the onAuthStateChange listener

    } catch (err: any) {
      let frenchError = "Une erreur est survenue. Veuillez réessayer.";
      if (err.message === "Invalid login credentials") {
        frenchError = "Email ou mot de passe incorrect.";
      } else if (err.message === "Email not confirmed") {
        frenchError = "Veuillez confirmer votre adresse e-mail pour vous connecter.";
      }
      setError(frenchError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-body p-4 h-full">
      {verificationMessage && !error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 max-w-md text-center p-3 rounded-lg text-sm z-[101]"
            style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', color: '#ccffcc', border: `1px solid #00ff00` }}
        >
            {verificationMessage}
        </div>
      )}
      <div className={`account-container ${!registrationSuccess && isActive ? "active" : ""}`} id="container">
      {registrationSuccess ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white bg-[#121926] rounded-lg">
              <h1 className="text-2xl font-bold mb-4 text-green-400">✅ Inscription réussie !</h1>
              <p className="mb-3">Un e-mail de confirmation vient de vous être envoyé.</p>
              <p className="text-sm text-gray-300 mb-3">
                Veuillez vérifier votre boîte de réception (et le dossier courrier indésirable ou spam) afin d’activer votre compte.
              </p>
              <p className="text-sm text-gray-300">
                Une fois votre adresse e-mail validée, vous pourrez accéder à votre tableau de bord.
              </p>
            </div>
          ) : (
            <>
              {/* Formulaire d'inscription */}
              <div className="form-container sign-up">
                <form onSubmit={handleSignUp} noValidate>
                  <h1>Créer un compte</h1>
                  <span className="mb-5">Utilisez votre email pour vous inscrire</span>

                  <div className="w-full text-left flex flex-col">
                    <label className="text-sm text-gray-300">Nom complet <span className="text-red-500">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                  </div>

                  <div className="w-full text-left flex flex-col">
                    <label className="text-sm text-gray-300">Adresse e-mail <span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>

                  <div className="w-full text-left flex flex-col">
                    <label className="text-sm text-gray-300">Mot de passe <span className="text-red-500">*</span></label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  
                  <div className="w-full">
                    <PasswordStrengthIndicator passwordCriteria={passwordCriteria} />
                  </div>

                  <div className="w-full text-left flex flex-col">
                    <label className="text-sm text-gray-300">Confirmer votre mot de passe <span className="text-red-500">*</span></label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                  
                  <div className="text-left w-full text-xs space-y-2 mt-4 text-gray-300">
                      <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} required className="mt-1" />
                          <span>J’accepte les <Link to="/conditions-generales-d-utilisation" target="_blank" className="text-blue-400 hover:underline">Conditions générales d’utilisation</Link> et la <Link to="/politique-de-confidentialite" target="_blank" className="text-blue-400 hover:underline">Politique de confidentialité</Link>. <span className="text-red-500">*</span></span>
                      </label>
                  </div>

                  <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'S\'inscrire'}</button>
                </form>
              </div>

              {/* Formulaire de connexion */}
              <div className="form-container sign-in">
                <form onSubmit={handleSignIn}>
                  <h1>Se connecter</h1>
                  <span className="mb-5">Utilisez votre compte pour vous connecter</span>
                  <input type="email" placeholder="Adresse e-mail" value={email} onChange={e => setEmail(e.target.value)} required/>
                  <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
                  <Link to="/reset-password" style={{color:'#007BFF', fontSize:'14px', marginTop:'10px'}}>Mot de passe oublié ?</Link>
                  <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'Connexion'}</button>
                </form>
              </div>

              {/* Panneau latéral */}
              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h1>Content de te revoir !</h1>
                    <p>Connecte-toi pour accéder à ton espace personnel</p>
                    <button type="button" className="hidden-btn" onClick={() => handleToggle(false)}>Se connecter</button>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h1>Bienvenue !</h1>
                    <p>Crée un compte pour rejoindre notre communauté</p>
                    <button type="button" className="hidden-btn" onClick={() => handleToggle(true)}>S'inscrire</button>
                  </div>
                </div>
              </div>
            </>
          )}
        
        {/* Feedback Messages */}
        {(!registrationSuccess && (error || successMessage)) && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 text-center p-3 rounded-lg text-sm z-[101]"
                style={{ backgroundColor: error ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
                         color: error ? '#ffcccc' : '#ccffcc',
                         border: `1px solid ${error ? '#ff0000' : '#00ff00'}`
                }}
            >
                {error || successMessage}
            </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;