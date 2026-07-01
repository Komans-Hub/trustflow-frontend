import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
            style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-xl text-gradient">TrustFlow</span>
          <span className="hidden sm:block text-white/20 text-xs font-mono mt-0.5">v1.0</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard"
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-body transition-colors">
                <LayoutDashboard size={15} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 btn-ghost text-sm !px-3 !py-2">
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn-ghost text-sm !px-4 !py-2">Sign in</Link>
              <Link to="/auth?tab=register" className="btn-primary text-sm !px-4 !py-2">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
