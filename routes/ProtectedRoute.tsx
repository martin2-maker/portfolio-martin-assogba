import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      // @ts-ignore
      const { data: { session } } = await window.supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();

    // @ts-ignore
    const { data: { subscription } } = window.supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/compte" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
