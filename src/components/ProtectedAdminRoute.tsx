import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl">Admin access required</h1>
        <p className="text-muted-foreground max-w-md">
          You're signed in, but this account doesn't have admin privileges. The site owner can grant you access from the database.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
