import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, ChevronRight, Lock } from 'lucide-react';
import api from '../api/client';
import TrustBadge from '../components/ui/TrustBadge';
import StarRating from '../components/ui/StarRating';

const STATE_COPY = {
  CREATED:   { headline: 'Secure checkout',          sub: 'Your payment is held in escrow until delivery.' },
  PAID:      { headline: 'Payment confirmed',         sub: 'Your funds are held safely. Awaiting shipment.' },
  SHIPPED:   { headline: 'Your order is on its way',  sub: 'The seller has shipped your item.' },
  DELIVERED: { headline: 'Delivered',                 sub: 'Confirm receipt to release funds to the seller.' },
  RELEASED:  { headline: 'Transaction complete',      sub: 'Funds have been released. Thank you for using TrustFlow.' },
  DISPUTED:  { headline: 'Dispute raised',            sub: 'Our team is reviewing this transaction.' },
};

function formatKobo(kobo) {
  return `₦ ${(Number(kobo) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

export default function Checkout() {
  const { token } = useParams();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Payment form
  const [step,     setStep]     = useState('review'); // review | form | done
  const [form,     setForm]     = useState({ buyer_name: '', buyer_email: '', buyer_phone: '' });
  const [paying,   setPaying]   = useState(false);
  const [payError, setPayError] = useState('');

  // Dispute form
  const [disputing, setDisputing] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/transactions/${token}`)
      .then(res => setData(res.data))
      .catch(() => setError('This checkout link is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handlePay = async () => {
    if (!form.buyer_name || !form.buyer_email || !form.buyer_phone) {
      setPayError('All fields are required.'); return;
    }
    setPaying(true); setPayError('');
    try {
      await api.post(`/transactions/${token}/pay`, form);
      // Re-fetch to get updated state
      const res = await api.get(`/transactions/${token}`);
      setData(res.data);
      setStep('done');
    } catch (e) {
      setPayError(e.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return;
    setDisputeSubmitting(true);
    try {
      await api.post(`/transactions/${data.transaction.id}/dispute`, {
        reason: disputeReason,
        buyer_email: data.transaction.buyer_email,
      });
      const res = await api.get(`/transactions/${token}`);
      setData(res.data);
      setDisputing(false);
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to raise dispute.');
    } finally {
      setDisputeSubmitting(false);
    }
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
    </main>
  );

  if (error) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
        <h1 className="font-display font-bold text-xl mb-2">Link not found</h1>
        <p className="text-white/40 font-body text-sm">{error}</p>
      </div>
    </main>
  );

  const { transaction: tx, seller } = data;
  const stateCopy = STATE_COPY[tx.state] || STATE_COPY.CREATED;
  const isPayable = tx.state === 'CREATED';
  const isShipped = tx.state === 'SHIPPED';
  const isComplete = ['RELEASED', 'DISPUTED'].includes(tx.state);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-8 pb-20 px-4">

      {/* TrustFlow watermark */}
      <div className="mb-8 flex items-center gap-2">
        <Shield size={16} className="text-cyan" />
        <span className="font-display font-semibold text-sm text-gradient">TrustFlow</span>
        <span className="text-white/20 text-xs font-mono">· Escrow Protected</span>
      </div>

      <div className="w-full max-w-sm space-y-4 animate-fade-up">

        {/* ── Seller Trust Card — the "receipt header" ──────────────────── */}
        <div className="card border-glow p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display font-bold text-base">{seller.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <TrustBadge tier={seller.tier} size="sm" />
                <StarRating score={Number(seller.trust_score)} size="sm" />
              </div>
            </div>
            {/* Verified shield */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                <Shield size={18} className="text-cyan" />
              </div>
              <span className="text-cyan text-[10px] font-mono">Verified</span>
            </div>
          </div>

          {/* Divider — receipt aesthetic */}
          <div className="border-t border-dashed border-white/10 my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40 font-body">Item</span>
              <span className="font-display font-medium text-right max-w-[180px] truncate">
                {tx.item_description}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40 font-body">Sales</span>
              <span className="font-body">{seller.transaction_count} completed</span>
            </div>
            {seller.remaining_to_next && (
              <div className="flex justify-between text-sm">
                <span className="text-white/40 font-body">Next tier</span>
                <span className="font-body text-white/50">
                  {seller.remaining_to_next} more → {seller.next_tier}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-white/10 my-4" />

          <div className="flex justify-between items-center">
            <span className="text-white/40 font-body text-sm">Total</span>
            <span className="font-mono font-bold text-2xl text-cyan">{formatKobo(tx.amount)}</span>
          </div>
        </div>

        {/* ── State Banner ──────────────────────────────────────────────── */}
        <div className={`rounded-2xl px-5 py-4 border text-center
          ${isComplete
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-cyan/5 border-cyan/20'}`}>
          <p className={`font-display font-semibold text-sm
            ${isComplete ? 'text-emerald-400' : 'text-cyan'}`}>
            {stateCopy.headline}
          </p>
          <p className="text-white/40 text-xs font-body mt-1">{stateCopy.sub}</p>
        </div>

        {/* ── Escrow explanation pills ──────────────────────────────────── */}
        {isPayable && step === 'review' && (
          <div className="space-y-2">
            {[
              { icon: '🔒', text: 'Your money is held securely — not sent to the seller yet' },
              { icon: '✅', text: 'Funds release only when you confirm delivery' },
              { icon: '🛡️', text: 'Dispute protection if something goes wrong' },
            ].map(p => (
              <div key={p.text} className="flex items-start gap-3 bg-navy-2 rounded-xl px-4 py-3
                                           border border-white/5 text-sm text-white/50 font-body">
                <span className="text-base flex-shrink-0">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Payment CTA / Form ────────────────────────────────────────── */}
        {isPayable && step === 'review' && (
          <button onClick={() => setStep('form')}
            className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
            <Lock size={15} /> Pay {formatKobo(tx.amount)} securely
            <ChevronRight size={16} />
          </button>
        )}

        {isPayable && step === 'form' && (
          <div className="card p-5 space-y-4">
            <p className="font-display font-semibold text-sm mb-1">Your details</p>
            <p className="text-white/30 text-xs font-body -mt-2">
              Required so the seller can confirm your order.
            </p>

            {[
              { key: 'buyer_name',  label: 'Full name',    type: 'text',  placeholder: 'Ayoola Orisasona' },
              { key: 'buyer_email', label: 'Email',        type: 'email', placeholder: 'you@example.com' },
              { key: 'buyer_phone', label: 'Phone number', type: 'tel',   placeholder: '+234 800 000 0000' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-white/40 font-body mb-1.5">{f.label}</label>
                <input className="input" type={f.type} placeholder={f.placeholder}
                       value={form[f.key]}
                       onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}

            {payError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3
                              text-red-400 text-sm font-body">
                {payError}
              </div>
            )}

            <button onClick={handlePay} disabled={paying}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              {paying
                ? <span className="w-4 h-4 border-2 border-navy/40 border-t-navy rounded-full animate-spin" />
                : <><Lock size={14} /> Confirm payment</>}
            </button>

            <button onClick={() => setStep('review')}
              className="w-full text-center text-xs text-white/20 font-body hover:text-white/40 transition-colors py-1">
              ← Go back
            </button>
          </div>
        )}

        {/* ── Post-payment: shipped, dispute ───────────────────────────── */}
        {isShipped && !disputing && (
          <div className="space-y-3">
            <p className="text-white/30 text-xs font-body text-center">
              Have you received your item?
            </p>
            <button
              onClick={async () => {
                try {
                  await api.post(`/transactions/${tx.id}/confirm`, { buyer_email: tx.buyer_email });
                  const res = await api.get(`/transactions/${token}`);
                  setData(res.data);
                } catch (e) { alert(e.response?.data?.error || 'Failed.'); }
              }}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              <CheckCircle size={16} /> Yes — release funds to seller
            </button>
            <button onClick={() => setDisputing(true)}
              className="w-full text-center text-xs text-red-400/60 hover:text-red-400 font-body transition-colors py-1">
              I have a problem with this order
            </button>
          </div>
        )}

        {/* ── Dispute form ──────────────────────────────────────────────── */}
        {disputing && (
          <div className="card border-red-500/20 p-5 space-y-4">
            <p className="font-display font-semibold text-sm text-red-400">Raise a dispute</p>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder="Describe what went wrong…"
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setDisputing(false)}
                className="btn-ghost flex-1 text-sm !py-2.5">Cancel</button>
              <button onClick={handleDispute} disabled={disputeSubmitting}
                className="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-display font-semibold
                           text-sm py-2.5 rounded-xl transition-all active:scale-95">
                {disputeSubmitting ? '…' : 'Submit dispute'}
              </button>
            </div>
          </div>
        )}

        {/* ── TrustFlow footer seal ─────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 pt-2 pb-4">
          <Shield size={12} className="text-white/20" />
          <span className="text-white/20 font-mono text-xs">
            Secured by TrustFlow Escrow
          </span>
        </div>
      </div>
    </main>
  );
}
