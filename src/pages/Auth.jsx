import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [params]  = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'merchant' });

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.full_name || !form.phone) { setError('All fields are required.'); setLoading(false); return; }
        await register(form);
      }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const switchTab = newTab => {
    setTab(newTab);
    setError('');
    setForm(f => ({ ...f, password: '' }));
  };

  return (
    <main className="min-h-screen bg-cloud pt-28 pb-section px-lg flex flex-col items-center">
      <div className="w-full max-w-md anim-fade-up">

        <Link to="/"
          className="inline-flex items-center gap-xs text-ink-soft text-caption-md font-body
                     hover:text-ink cursor-pointer transition-all duration-150 mb-xxl
                     hover:-translate-x-1">
          <ArrowLeft size={14}/> Back to home
        </Link>

        {/* Brand */}
        <div className="flex items-center gap-sm mb-xxl">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center
                          transition-transform duration-200 hover:scale-105 cursor-default">
            <Shield size={18} className="text-white"/>
          </div>
          <div>
            <p className="font-display font-semibold text-ink text-base">TrustFlow</p>
            <p className="font-body text-caption-sm text-ink-soft">Escrow-protected commerce</p>
          </div>
        </div>

        <h1 className="font-display text-display-md text-ink mb-xs
                       transition-all duration-300">
          {tab === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="font-body text-body-md text-ink-soft mb-xl
                      transition-all duration-300">
          {tab === 'login'
            ? 'Sign in to your merchant dashboard.'
            : 'Start selling with escrow protection today.'}
        </p>

        {/* Tab toggle with sliding indicator */}
        <div className="relative flex bg-paper border border-hairline rounded-pill p-xs mb-xl">
          {/* Sliding pill background */}
          <div className={`absolute top-xs bottom-xs rounded-pill bg-primary shadow-soft-lift
                           transition-all duration-300 ease-out`}
               style={{ left: tab === 'login' ? '4px' : '50%', width: 'calc(50% - 4px)' }}/>
          {['login','register'].map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`relative z-10 flex-1 py-xs rounded-pill font-body font-semibold
                          text-caption-md cursor-pointer transition-colors duration-300
                          ${tab === t ? 'text-white' : 'text-ink-soft hover:text-ink'}`}>
              {t === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Form card — animates on tab switch */}
        <div className={`card p-xl space-y-md transition-all duration-300
                         ${success ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
          {/* Register extra fields — slide in */}
          <div className={`space-y-md overflow-hidden transition-all duration-300
                           ${tab === 'register' ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="anim-fade-up">
              <label className="block font-body text-caption-md text-ink font-medium mb-xs">
                Full name
              </label>
              <input className="input" placeholder="Ayoola Orisasona"
                     value={form.full_name} onChange={set('full_name')}/>
            </div>
            <div className="anim-fade-up" style={{ animationDelay: '0.05s' }}>
              <label className="block font-body text-caption-md text-ink font-medium mb-xs">
                Phone number
              </label>
              <input className="input" placeholder="+234 800 000 0000"
                     value={form.phone} onChange={set('phone')}/>
            </div>
            <div className="anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <label className="block font-body text-caption-md text-ink font-medium mb-xs">
                Account type
              </label>
              <select className="input" value={form.role} onChange={set('role')}>
                <option value="merchant">Merchant — I want to sell</option>
                <option value="buyer">Buyer — I want to purchase</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-body text-caption-md text-ink font-medium mb-xs">
              Email address
            </label>
            <input className="input" type="email" placeholder="you@example.com"
                   value={form.email} onChange={set('email')}/>
          </div>

          <div>
            <label className="block font-body text-caption-md text-ink font-medium mb-xs">
              Password
            </label>
            <div className="relative">
              <input className="input pr-10" type={showPw ? 'text' : 'password'}
                     placeholder="••••••••" value={form.password} onChange={set('password')}/>
              <button onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft
                           hover:text-ink cursor-pointer transition-all duration-150 hover:scale-110">
                <div className={`transition-all duration-200 ${showPw ? 'opacity-100 rotate-0' : 'opacity-100 rotate-0'}`}>
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </div>
              </button>
            </div>
          </div>

          {/* Error — slides in */}
          <div className={`transition-all duration-200 overflow-hidden
                           ${error ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-red-50 border border-red-200 rounded-lg px-md py-sm
                            text-red-700 text-caption-md font-body anim-toast">
              {error}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary ripple-wrapper w-full flex items-center
                       justify-center gap-2 !py-sm">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white
                               rounded-full animate-spin"/>
            ) : tab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <p className="text-center font-body text-caption-md text-ink-soft mt-lg">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
            className="text-link hover:text-link-pressed cursor-pointer font-medium
                       transition-colors duration-150 underline underline-offset-2">
            {tab === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  );
}
