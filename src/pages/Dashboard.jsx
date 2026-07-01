import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Plus, X, CheckCircle, Clock, Truck, Ban, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import TrustBadge from '../components/ui/TrustBadge';
import StarRating from '../components/ui/StarRating';

const STATE_META = {
  CREATED:   { label: 'Awaiting payment', color: 'text-white/40',   icon: Clock      },
  PAID:      { label: 'Paid — Ship now',  color: 'text-cyan',        icon: CheckCircle },
  SHIPPED:   { label: 'Shipped',          color: 'text-blue-400',    icon: Truck      },
  DELIVERED: { label: 'Delivered',        color: 'text-emerald-400', icon: CheckCircle },
  RELEASED:  { label: 'Complete',         color: 'text-emerald-400', icon: CheckCircle },
  DISPUTED:  { label: 'Disputed',         color: 'text-red-400',     icon: Ban        },
};

function formatKobo(kobo) {
  return `₦ ${(Number(kobo) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile,      setProfile]      = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading,    setTxLoading]    = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [copied,       setCopied]       = useState('');

  // Link generator form
  const [form,      setForm]      = useState({ item_description: '', amount: '' });
  const [genLoading, setGenLoading] = useState(false);
  const [genError,   setGenError]   = useState('');
  const [newLink,    setNewLink]    = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [profileRes, txRes] = await Promise.all([
        api.get(`/merchants/${user.id}/profile`),
        api.get(`/merchants/${user.id}/transactions`),
      ]);
      setProfile(profileRes.data.merchant);
      setTransactions(txRes.data.transactions);
    } catch (e) {
      console.error(e);
    } finally {
      setTxLoading(false);
    }
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
        item_description: form.item_description,
        amount: amountKobo,
      });
      setNewLink(`${window.location.origin}/checkout/${data.transaction.checkout_token}`);
      setForm({ item_description: '', amount: '' });
      fetchData();
    } catch (e) {
      setGenError(e.response?.data?.error || 'Failed to generate link.');
    } finally {
      setGenLoading(false);
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(link);
    setTimeout(() => setCopied(''), 2000);
  };

  const markShipped = async (id) => {
    try { await api.post(`/transactions/${id}/ship`); fetchData(); }
    catch (e) { alert(e.response?.data?.error || 'Failed to mark shipped'); }
  };

  if (authLoading || !user) return null;

  const progress = profile
    ? profile.next_tier
      ? Math.round((profile.transaction_count / (profile.transaction_count + profile.remaining_to_next)) * 100)
      : 100
    : 0;

  return (
    <main className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-white/30 font-body text-sm mb-1">Welcome back</p>
            <h1 className="font-display font-bold text-2xl">{user.full_name}</h1>
          </div>
          <button onClick={() => { setShowModal(true); setNewLink(null); }}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus size={16} /> Generate checkout link
          </button>
        </div>

        {/* ── Trust Profile Card ────────────────────────────────────────── */}
        {profile && (
          <div className="card border-glow p-6 mb-6 grid sm:grid-cols-3 gap-6">
            {/* Tier */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Trust Tier</p>
              <TrustBadge tier={profile.tier} size="lg" />
              {profile.next_tier && (
                <div className="mt-1">
                  <div className="flex justify-between text-xs text-white/30 font-body mb-1">
                    <span>{profile.transaction_count} sales</span>
                    <span>{profile.remaining_to_next} to {profile.next_tier}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan rounded-full transition-all duration-700"
                         style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Trust Score</p>
              <p className="font-display font-bold text-3xl">{Number(profile.trust_score).toFixed(1)}</p>
              <StarRating score={Number(profile.trust_score)} size="sm" />
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest">Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Completed', val: profile.transaction_count },
                  { label: 'Disputes',  val: profile.dispute_count },
                  { label: 'Volume',    val: formatKobo(profile.total_volume), span: true },
                ].map(s => (
                  <div key={s.label} className={`bg-navy-3 rounded-xl p-3 ${s.span ? 'col-span-2' : ''}`}>
                    <p className="text-xs text-white/30 font-body mb-0.5">{s.label}</p>
                    <p className="font-display font-semibold text-sm">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Transactions ─────────────────────────────────────────────── */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-base mb-4">Transactions</h2>

          {txLoading ? (
            <div className="py-12 text-center text-white/20 font-body text-sm">Loading…</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-white/20 font-body text-sm mb-3">No transactions yet.</p>
              <button onClick={() => setShowModal(true)} className="text-cyan text-sm font-body hover:underline">
                Generate your first checkout link →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(tx => {
                const meta = STATE_META[tx.state] || STATE_META.CREATED;
                const Icon = meta.icon;
                return (
                  <div key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4
                               bg-navy-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-medium text-sm truncate">{tx.item_description}</p>
                      <p className="text-xs text-white/30 font-mono mt-0.5">
                        {new Date(tx.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {tx.buyer_name && ` · ${tx.buyer_name}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-mono text-sm font-semibold">{formatKobo(tx.amount)}</span>

                      <span className={`flex items-center gap-1 text-xs font-body ${meta.color}`}>
                        <Icon size={12} /> {meta.label}
                      </span>

                      {tx.state === 'PAID' && (
                        <button onClick={() => markShipped(tx.id)}
                          className="text-xs btn-primary !px-3 !py-1.5">
                          Mark shipped
                        </button>
                      )}

                      <button
                        onClick={() => copyLink(`${window.location.origin}/checkout/${tx.checkout_token}`)}
                        className="text-white/20 hover:text-cyan transition-colors"
                        title="Copy checkout link">
                        {copied === `${window.location.origin}/checkout/${tx.checkout_token}`
                          ? <CheckCircle size={14} className="text-emerald-400" />
                          : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Link Generator Modal ──────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
             style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="card border-glow w-full max-w-md p-8 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg">New checkout link</h3>
              <button onClick={() => { setShowModal(false); setNewLink(null); setGenError(''); }}
                className="text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {newLink ? (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
                  <p className="font-display font-semibold text-sm text-emerald-400 mb-1">Link ready</p>
                  <p className="text-white/40 text-xs font-body">Share this with your buyer</p>
                </div>

                <div className="bg-navy-3 rounded-xl px-4 py-3 flex items-center gap-3">
                  <p className="font-mono text-xs text-cyan truncate flex-1">{newLink}</p>
                  <button onClick={() => copyLink(newLink)}
                    className="text-white/40 hover:text-cyan transition-colors flex-shrink-0">
                    {copied === newLink ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="flex gap-3">
                  <a href={newLink} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost flex-1 flex items-center justify-center gap-1.5 text-sm !py-2.5">
                    <ExternalLink size={13} /> Preview
                  </a>
                  <button onClick={() => { setShowModal(false); setNewLink(null); }}
                    className="btn-primary flex-1 text-sm !py-2.5">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-body text-white/40 mb-1.5">Item name</label>
                  <input className="input" placeholder="e.g. Nike Air Force 1 — Size 42"
                         value={form.item_description}
                         onChange={e => setForm(f => ({ ...f, item_description: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-body text-white/40 mb-1.5">Amount (₦)</label>
                  <input className="input" type="number" placeholder="65000"
                         value={form.amount}
                         onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  <p className="text-xs text-white/20 font-body mt-1">Enter in full Naira — e.g. 65000 for ₦65,000</p>
                </div>

                {genError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {genError}
                  </div>
                )}

                <button onClick={generateLink} disabled={genLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {genLoading
                    ? <span className="inline-block w-4 h-4 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
                    : <><Plus size={15} /> Generate link</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
