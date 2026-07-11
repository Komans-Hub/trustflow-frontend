import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LayoutDashboard, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  // Shrink shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-6">
      <nav className={`w-full max-w-content bg-paper rounded-pill
                       flex items-center justify-between px-md py-xs
                       transition-all duration-300
                       ${scrolled ? 'shadow-modal' : 'shadow-card'}`}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center
                          transition-transform duration-200 group-hover:scale-110">
            <Shield size={13} className="text-white"/>
          </div>
          <span className="font-display font-semibold text-ink text-base tracking-tight
                           transition-colors duration-200 group-hover:text-primary">
            TrustFlow
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-xs">
          {[
            { label: 'How it works', href: '#how-it-works' },
            { label: 'Trust Tiers',  href: '#how-it-works' },
            { label: 'For Merchants',href: '/auth?tab=register' },
          ].map(({ label, href }) => (
            <a key={label} href={href}
               className="nav-underline text-ink-soft text-caption-md font-body
                          px-sm py-xs rounded-sm cursor-pointer
                          hover:text-ink transition-colors duration-100">
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-xs">
          {user ? (
            <>
              <Link to="/dashboard"
                className="flex items-center gap-1 text-ink-soft text-caption-md font-body
                           px-sm py-xs rounded-sm nav-underline
                           hover:text-primary cursor-pointer transition-colors duration-100">
                <LayoutDashboard size={13}/> Dashboard
              </Link>
              <button onClick={handleLogout}
                className="btn-ghost-dark !px-md !py-xs !text-caption-md">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth"
                className="nav-underline text-ink-soft text-caption-md font-body
                           px-sm py-xs rounded-sm hover:text-ink
                           cursor-pointer transition-colors duration-100">
                Sign in
              </Link>
              <Link to="/auth?tab=register"
                className="btn-primary ripple-wrapper !px-md !py-xs !text-caption-md">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-ink p-xs cursor-pointer
                           transition-transform duration-200 hover:scale-110"
                onClick={() => setOpen(o => !o)}>
          <div className={`transition-all duration-200 ${open ? 'rotate-90 opacity-0 absolute' : 'rotate-0 opacity-100'}`}>
            <Menu size={20}/>
          </div>
          <div className={`transition-all duration-200 ${open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 absolute'}`}>
            <X size={20}/>
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`absolute top-20 left-6 right-6 bg-canvas rounded-xl shadow-modal
                       border border-hairline p-lg flex flex-col gap-xs
                       transition-all duration-300 origin-top
                       ${open
                         ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                         : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
        {user ? (
          <>
            <Link to="/dashboard"
              className="text-ink font-body text-body-md py-xs cursor-pointer
                         hover:text-primary transition-colors duration-150">
              Dashboard
            </Link>
            <button onClick={handleLogout}
              className="text-left text-ink-soft font-body text-body-md py-xs
                         cursor-pointer hover:text-primary transition-colors duration-150">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/auth"
              className="text-ink font-body text-body-md py-xs cursor-pointer
                         hover:text-primary transition-colors duration-150">
              Sign in
            </Link>
            <Link to="/auth?tab=register" className="btn-primary text-center mt-xs">
              Get started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
