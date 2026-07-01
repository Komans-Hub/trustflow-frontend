import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [params]    = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', role: 'merchant',
  });

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.full_name || !form.phone) {
          setError('All fields are required.'); setLoading(false); return;
        }
        await register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-16 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-up">

        <Link to="/" className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60
                                 text-sm font-body transition-colors mb-8">
          <ArrowLeft size={14} /> Back to home
        </Link>

        {/* Card */}
        <div className="card border-glow p-8">
          {/* Tabs */}
          <div className="flex bg-navy-3 rounded-xl p-1 mb-8">
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg font-display font-medium text-sm capitalize transition-all duration-200
                            ${tab === t ? 'bg-navy-4 text-white shadow' : 'text-white/30 hover:text-white/60'}`}>
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-body text-white/40 mb-1.5">Full name</label>
                  <input className="input" placeholder="Ayoola Orisasona"
                         value={form.full_name} onChange={set('full_name')} />
                </div>
                <div>
                  <label className="block text-xs font-body text-white/40 mb-1.5">Phone number</label>
                  <input className="input" placeholder="+234 800 000 0000"
                         value={form.phone} onChange={set('phone')} />
                </div>
                <div>
                  <label className="block text-xs font-body text-white/40 mb-1.5">Account type</label>
                  <select className="input" value={form.role} onChange={set('role')}>
                    <option value="merchant">Merchant — I want to sell</option>
                    <option value="buyer">Buyer — I want to purchase</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-body text-white/40 mb-1.5">Email address</label>
              <input className="input" type="email" placeholder="you@example.com"
                     value={form.email} onChange={set('email')} />
            </div>

            <div>
              <label className="block text-xs font-body text-white/40 mb-1.5">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPw ? 'text' : 'password'}
                       placeholder="••••••••" value={form.password} onChange={set('password')} />
                <button onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3
                              text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-navy/40 border-t-navy
                                 rounded-full animate-spin" />
              ) : tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs font-body mt-6">
          {tab === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className="text-cyan hover:text-cyan/80 transition-colors">
            {tab === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </main>
  );
}
