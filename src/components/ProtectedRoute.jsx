import { Navigate, useLocation } from 'react-router-dom';
import { useExamAuth } from '../context/ExamAuthContext';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useExamAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--gold)' }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    // Not logged in as a team (or admin) — send to login, remembering where
    // they were headed so we can bounce them back after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
