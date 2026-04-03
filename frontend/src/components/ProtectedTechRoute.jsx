/**
 * ProtectedTechRoute
 *
 * Guards every /technical-user/* route with two checks:
 *   1. Is the user logged in?  (token present)
 *   2. Has the user accepted the Rules of Engagement?  (has_consented flag)
 *
 * Not logged-in  → redirect to /login
 * Logged in but  → redirect to /consent
 *   not consented
 * Both OK        → render children
 */
import { Navigate } from 'react-router-dom';

export default function ProtectedTechRoute({ children }) {
  const token = localStorage.getItem('cybercare_token');
  const user  = JSON.parse(localStorage.getItem('cybercare_user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.has_consented) {
    return <Navigate to="/consent" replace />;
  }

  return children;
}