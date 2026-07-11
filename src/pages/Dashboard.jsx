import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, X, CheckCircle, Clock, Truck, Ban, ExternalLink, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import TrustBadge from '../components/ui/TrustBadge';
import StarRating from '../components/ui/StarRating';

const STATE_META = {
  CREATED:   { label: 'Awaiting payment', color: 'text-ink-soft',    bg: 'bg-cloud',           icon: Clock       },
  PAID:      { label: 'Paid — ship now',  color: 'text-primary',     bg: 'bg-hairline',        icon: CheckCircle },
  SHIPPED:   { label: 'Shipped',          color: 'text-link',        bg: 'bg-blue-50',         icon: Truck       },
  DELIVERED: { label: 'Delivered',        color: 'text-emerald-600', bg: 'bg-emerald-50',      icon: CheckCircle },
  RELEASED:  { label: 'Complete',         color: 'text-emerald-600', bg: 'bg-emerald-50',      icon: CheckCircle },
  DISPUTED:  { label: 'Disputed',         color: 'text-red-600',     bg: 'bg-red-50',          icon: Ban         },
};

function formatKobo(k) {
  return `₦ ${(Number(k)/100).toLocaleString('en-NG',{minimumFractionDigits:0})}`;
}

/* Shimmer skeleton */
function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-lg ${className}`}/>;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile,      setProfile]      = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading,    setTxLoading]    = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [copied,       setCopied]       = useState('');
  const [shippping,    setShipping]     = useState(null);
  const [form,         setForm]         = useState({ item_description: '', amount: '' });
  const [genLoading,   setGenLoading]   = useState(false);
  const [genError,     setGenError]     = useState('');
  const [newLink,      setNewLink]      = useState(null);
  const progressRef = useRef(null);

  useEffect(() => { if (!authLoading && !user) navigate('/auth'); }, [user, authLoading]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [pRes, tRes] = await Promise.all([
        api.get(`/merchants/${user.id}/profile`),
        api.get(`/merchants/${user.id}/transactions`),
      ]);
      setProfile(pRes.data.merchant);
      setTransactions(tRes.data.transactions);
    } catch(e) { console.error(e); }
    finally { setTxLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const generateLink = async () => {
    setGenLoading(true); setGenError(''); setNewLink(null);
    try {
      const amountKobo = Math.round(parseFloat(form.amount) * 100);
      if (!form.item_description || isNaN(amountKobo) || amountKobo < 1) {
        setGenError('Enter a valid item name and amount.'); setGenLoading(false); return;
      }
      const { data } = await api.post('/transactions', {
        item_description: form.item_description, amount: amountKobo,
      });
      setNewLink(`${window.location.origin}/checkout/${data.transaction.checkout_token}`);
      setForm({ item_description: '', amount: '' });
      fetchData();
    } catch(e) { setGenError(e.response?.data?.error || 'Failed to generate link.'); }
    finally { setGenLoading(false); }
  };

  const copyLink = link => {
    navigator.clipboard.writeText(link);
    setCopied(link);
    setTimeout(() => setCopied(''), 2000);
  };

  const markShipped = async id => {
    setShipping(id);
    try { await api.post(`/transactions/${id}/ship`); fetchData(); }
    catch(e) { alert(e.response?.data?.error || 'Failed'); }
    finally { setShipping(null); }
  };

  if (authLoading || !user) return null;

  const progress = profile?.next_tier
    ? Math.round((profile.transaction_count / (profile.transaction_count + profile.remaining_to_next)) * 100)
    : 100;

  return (
    <main className="min-h-screen bg-cloud pt-28 pb-section">
      <div className="container-content">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl anim-fade-up">
          <div>
            <p className="font-body text-caption-md text-ink-soft mb-xs">Welcome back</p>
            <h1 className="font-display text-display-md text-ink">{user.full_name}</h1>
          </div>
          <button onClick={() => { setShowModal(true); setNewLink(null); }}
            className="btn-primary ripple-wrapper self-start sm:self-auto
                       flex items-center gap-xs">
            <Plus size={15}/> Generate checkout link
          </button>
        </div>

        {/* ── Trust profile card ──────────────────────────────────────────── */}
        {txLoading ? (
          <div className="card p-xl mb-lg grid sm:grid-cols-3 gap-xl anim-fade-up"
               style={{ animationDelay: '0.05s' }}>
            <Skeleton className="h-24"/>
            <Skeleton className="h-24"/>
            <Skeleton className="h-24"/>
          </div>
        ) : profile && (
          <div className="card p-xl mb-lg grid sm:grid-cols-3 gap-xl anim-fade-up"
               style={{ animationDelay: '0.1s' }}>

            {/* Tier */}
            <div>
              <p className="font-body text-caption-sm text-ink-soft uppercase tracking-widest mb-sm">
                Trust Tier
              </p>
              <div className="anim-badge-pop" style={{ animationDelay: '0.3s' }}>
                <TrustBadge tier={profile.tier} size="lg"/>
              </div>
              {profile.next_tier && (
                <div className="mt-md">
                  <div className="flex justify-between font-body text-caption-sm text-ink-soft mb-xs">
                    <span>{profile.transaction_count} sales</span>
                    <span>{profile.remaining_to_next} to {profile.next_tier}</span>
                  </div>
                  <div className="h-1.5 bg-cloud rounded-pill overflow-hidden">
                    <div className="h-full bg-primary rounded-pill anim-progress-bar"
                         style={{ '--progress': `${progress}%` }}/>
                  </div>
                </div>
              )}
            </div>

            {/* Score */}
            <div>
              <p className="font-body text-caption-sm text-ink-soft uppercase tracking-widest mb-sm">
                Trust Score
              </p>
              <p className="font-display text-display-lg text-ink mb-xs anim-count"
                 style={{ animationDelay: '0.2s' }}>
                {Number(profile.trust_score).toFixed(1)}
              </p>
              <StarRating score={Number(profile.trust_score)}/>
            </div>

            {/* Stats */}
            <div>
              <p className="font-body text-caption-sm text-ink-soft uppercase tracking-widest mb-sm">
                Activity
              </p>
              <div className="grid grid-cols-2 gap-sm stagger-children">
                {[
                  { label: 'Completed', val: profile.transaction_count },
                  { label: 'Disputes',  val: profile.dispute_count },
                  { label: 'Volume',    val: formatKobo(profile.total_volume), span: true },
                ].map(s => (
                  <div key={s.label}
                    className={`bg-cloud rounded-lg p-sm anim-fade-up
                                hover:bg-paper transition-colors duration-200
                                ${s.span ? 'col-span-2' : ''}`}>
                    <p className="font-body text-caption-sm text-ink-soft">{s.label}</p>
                    <p className="font-display text-display-sm text-ink mt-xs">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Transactions ──────────────────────────────────────────────────── */}
        <div className="card p-xl anim-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-display text-display-sm text-ink">Transactions</h2>
            <TrendingUp size={18} className="text-ink-soft"/>
          </div>

          {txLoading ? (
            <div className="space-y-sm">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16"/>)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-xxl text-center anim-scale-in">
              <p className="font-body text-body-md text-ink-soft mb-md">No transactions yet.</p>
              <button onClick={() => setShowModal(true)}
                className="font-body text-caption-md text-primary hover:text-primary-bright
                           cursor-pointer transition-colors duration-150
                           inline-flex items-center gap-xs group">
                Generate your first checkout link
                <ChevronRight size={13}
                  className="transition-transform duration-150 group-hover:translate-x-1"/>
              </button>
            </div>
          ) : (
            <div className="space-y-sm stagger-children">
              {transactions.map((tx, i) => {
                const meta = STATE_META[tx.state] || STATE_META.CREATED;
                const Icon = meta.icon;
                const link = `${window.location.origin}/checkout/${tx.checkout_token}`;
                return (
                  <div key={tx.id}
                    className="anim-fade-up flex flex-col sm:flex-row sm:items-center gap-sm p-md
                               bg-cloud rounded-lg border border-hairline
                               hover:border-primary/30 hover:bg-paper hover:-translate-y-0.5
                               transition-all duration-200 cursor-default group">
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-body-md text-ink truncate
                                   group-hover:text-primary transition-colors duration-200">
                        {tx.item_description}
                      </p>
                      <p className="font-body text-caption-sm text-ink-soft mt-xs">
                        {new Date(tx.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {tx.buyer_name && ` · ${tx.buyer_name}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-sm flex-shrink-0">
                      <span className="font-display text-display-sm text-ink">
                        {formatKobo(tx.amount)}
                      </span>
                      <span className={`inline-flex items-center gap-xs font-body text-caption-sm
                                       px-sm py-xs rounded-pill transition-all duration-200
                                       ${meta.color} ${meta.bg}`}>
                        <Icon size={11}/> {meta.label}
                      </span>
                      {tx.state === 'PAID' && (
                        <button onClick={() => markShipped(tx.id)}
                          disabled={shippping === tx.id}
                          className="btn-primary ripple-wrapper !px-sm !py-xs !text-caption-sm">
                          {shippping === tx.id
                            ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"/>
                            : 'Mark shipped'}
                        </button>
                      )}
                      <button onClick={() => copyLink(link)}
                        className="text-ink-soft hover:text-primary cursor-pointer
                                   transition-all duration-150 p-xs hover:scale-110">
                        {copied === link
                          ? <CheckCircle size={15} className="text-emerald-500 anim-scale-in"/>
                          : <Copy size={15}/>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-lg anim-overlay"
             style={{ background: 'rgba(1,46,55,0.45)', backdropFilter: 'blur(6px)' }}
             onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setNewLink(null); } }}>
          <div className="card p-xl w-full max-w-md anim-modal">
            <div className="flex items-center justify-between mb-xl">
              <h3 className="font-display text-display-sm text-ink">New checkout link</h3>
              <button onClick={() => { setShowModal(false); setNewLink(null); setGenError(''); }}
                className="text-ink-soft hover:text-ink cursor-pointer transition-all
                           duration-150 p-xs hover:scale-110 hover:rotate-90">
                <X size={20}/>
              </button>
            </div>

            {newLink ? (
              <div className="space-y-md anim-scale-in">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-lg text-center">
                  <CheckCircle size={28} className="text-emerald-500 mx-auto mb-sm anim-badge-pop"/>
                  <p className="font-display text-display-sm text-emerald-700">Link ready</p>
                  <p className="font-body text-caption-md text-emerald-600 mt-xs">Share this with your buyer</p>
                </div>
                <div className="bg-cloud rounded-lg px-md py-sm flex items-center
                               gap-sm border border-hairline hover:border-primary/30
                               transition-colors duration-200">
                  <p className="font-body text-caption-md text-link truncate flex-1">{newLink}</p>
                  <button onClick={() => copyLink(newLink)}
                    className="text-ink-soft hover:text-primary cursor-pointer
                               flex-shrink-0 transition-all duration-150 hover:scale-110">
                    {copied === newLink
                      ? <CheckCircle size={15} className="text-emerald-500 anim-scale-in"/>
                      : <Copy size={15}/>}
                  </button>
                </div>
                <div className="flex gap-sm">
                  <a href={newLink} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost-dark flex-1 flex items-center justify-center gap-xs !py-sm">
                    <ExternalLink size={13}/> Preview
                  </a>
                  <button onClick={() => { setShowModal(false); setNewLink(null); }}
                    className="btn-primary ripple-wrapper flex-1 !py-sm">Done</button>
                </div>
              </div>
            ) : (
              <div className="space-y-md">
                <div className="anim-fade-up">
                  <label className="block font-body text-caption-md text-ink font-medium mb-xs">
                    Item name
                  </label>
                  <input className="input" placeholder="e.g. Nike Air Force 1 — Size 42"
                         value={form.item_description}
                         onChange={e => setForm(f => ({ ...f, item_description: e.target.value }))}/>
                </div>
                <div className="anim-fade-up" style={{ animationDelay: '0.05s' }}>
                  <label className="block font-body text-caption-md text-ink font-medium mb-xs">
                    Amount (₦)
                  </label>
                  <input className="input" type="number" placeholder="65000"
                         value={form.amount}
                         onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}/>
                  <p className="font-body text-caption-sm text-ink-soft mt-xs">
                    Enter full Naira — e.g. 65000 for ₦65,000
                  </p>
                </div>
                <div className={`overflow-hidden transition-all duration-200
                                 ${genError ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-red-50 border border-red-200 rounded-lg px-md py-sm
                                  text-red-700 font-body text-caption-md anim-toast">
                    {genError}
                  </div>
                </div>
                <button onClick={generateLink} disabled={genLoading}
                  className="btn-primary ripple-wrapper w-full flex items-center
                             justify-center gap-xs !py-sm anim-fade-up"
                  style={{ animationDelay: '0.1s' }}>
                  {genLoading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    : <><Plus size={15}/> Generate link</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
