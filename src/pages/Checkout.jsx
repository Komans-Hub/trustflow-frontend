import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Lock, ChevronRight } from 'lucide-react';
import api from '../api/client';
import TrustBadge from '../components/ui/TrustBadge';
import StarRating from '../components/ui/StarRating';

const STATE_COPY = {
  CREATED:   { headline: 'Secure checkout',          sub: 'Your payment is held in escrow until delivery is confirmed.' },
  PAID:      { headline: 'Payment confirmed',         sub: 'Your funds are held safely. Awaiting shipment from seller.' },
  SHIPPED:   { headline: 'Your order is on its way', sub: 'The seller has shipped your item.' },
  DELIVERED: { headline: 'Item delivered',           sub: 'Confirm receipt to release payment to the seller.' },
  RELEASED:  { headline: 'Transaction complete',     sub: 'Funds released. Thank you for using TrustFlow.' },
  DISPUTED:  { headline: 'Dispute raised',           sub: 'Our team will review this transaction shortly.' },
};

function formatKobo(k) {
  return `₦ ${(Number(k)/100).toLocaleString('en-NG',{minimumFractionDigits:0})}`;
}

export default function Checkout() {
  const { token } = useParams();
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [step,       setStep]       = useState('review');
  const [form,       setForm]       = useState({ buyer_name: '', buyer_email: '', buyer_phone: '' });
  const [paying,     setPaying]     = useState(false);
  const [payError,   setPayError]   = useState('');
  const [disputing,  setDisputing]  = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSub, setDisputeSub] = useState(false);
  const [confirmed,  setConfirmed]  = useState(false);

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
      const res = await api.get(`/transactions/${token}`);
      setData(res.data); setStep('done');
    } catch(e) { setPayError(e.response?.data?.error || 'Payment failed. Please try again.'); }
    finally { setPaying(false); }
  };

  const handleConfirm = async () => {
    setConfirmed(true);
    try {
      await api.post(`/transactions/${data.transaction.id}/confirm`, { buyer_email: data.transaction.buyer_email });
      const res = await api.get(`/transactions/${token}`);
      setData(res.data);
    } catch(e) { alert(e.response?.data?.error || 'Failed.'); setConfirmed(false); }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return;
    setDisputeSub(true);
    try {
      await api.post(`/transactions/${data.transaction.id}/dispute`, {
        reason: disputeReason, buyer_email: data.transaction.buyer_email,
      });
      const res = await api.get(`/transactions/${token}`);
      setData(res.data); setDisputing(false);
    } catch(e) { alert(e.response?.data?.error || 'Failed.'); }
    finally { setDisputeSub(false); }
  };

  if (loading) return (
    <main className="min-h-screen bg-cloud flex items-center justify-center">
      <div className="flex flex-col items-center gap-md">
        <div className="w-8 h-8 border-2 border-hairline border-t-primary rounded-full animate-spin"/>
        <p className="font-body text-caption-md text-ink-soft anim-fade-up">Loading checkout…</p>
      </div>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-cloud flex items-center justify-center px-lg">
      <div className="text-center anim-scale-in">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-md"/>
        <h1 className="font-display text-display-sm text-ink mb-sm">Link not found</h1>
        <p className="font-body text-body-md text-ink-soft">{error}</p>
      </div>
    </main>
  );

  const { transaction: tx, seller } = data;
  const stateCopy = STATE_COPY[tx.state] || STATE_COPY.CREATED;
  const isPayable  = tx.state === 'CREATED';
  const isShipped  = tx.state === 'SHIPPED';
  const isComplete = ['RELEASED','DISPUTED'].includes(tx.state);

  return (
    <main className="min-h-screen bg-cloud flex flex-col items-center pt-xxl pb-section px-md">

      {/* TrustFlow header */}
      <div className="flex items-center gap-sm mb-xl anim-fade-up">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center
                        transition-transform duration-300 hover:scale-110 cursor-default">
          <Shield size={14} className="text-white"/>
        </div>
        <span className="font-display font-semibold text-ink text-base">TrustFlow</span>
        <span className="font-body text-caption-sm text-ink-soft">· Escrow Protected</span>
      </div>

      <div className="w-full max-w-sm space-y-md">

        {/* Seller trust card */}
        <div className="card p-lg anim-fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-start justify-between mb-lg">
            <div>
              <p className="font-display text-display-sm text-ink mb-xs">{seller.name}</p>
              <div className="flex items-center gap-sm">
                <div className="anim-badge-pop" style={{ animationDelay: '0.2s' }}>
                  <TrustBadge tier={seller.tier} size="sm"/>
                </div>
                <StarRating score={Number(seller.trust_score)} size="sm"/>
              </div>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <div className="w-10 h-10 bg-hairline rounded-full flex items-center justify-center
                              anim-badge-pop" style={{ animationDelay: '0.25s' }}>
                <Shield size={16} className="text-primary"/>
              </div>
              <span className="font-body text-caption-sm text-primary anim-fade-up"
                    style={{ animationDelay: '0.3s' }}>Verified</span>
            </div>
          </div>

          <div className="border-t border-dashed border-hairline my-md"/>

          <div className="space-y-sm stagger-children">
            <div className="flex justify-between anim-fade-up">
              <span className="font-body text-caption-md text-ink-soft">Item</span>
              <span className="font-body text-caption-md text-ink font-medium truncate max-w-[180px]">
                {tx.item_description}
              </span>
            </div>
            <div className="flex justify-between anim-fade-up">
              <span className="font-body text-caption-md text-ink-soft">Completed sales</span>
              <span className="font-body text-caption-md text-ink">{seller.transaction_count}</span>
            </div>
            {seller.remaining_to_next && (
              <div className="flex justify-between anim-fade-up">
                <span className="font-body text-caption-md text-ink-soft">Next tier</span>
                <span className="font-body text-caption-md text-ink-soft">
                  {seller.remaining_to_next} more → {seller.next_tier}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-hairline my-md"/>

          <div className="flex justify-between items-center anim-count"
               style={{ animationDelay: '0.3s' }}>
            <span className="font-body text-caption-md text-ink-soft">Total</span>
            <span className="font-display text-display-md text-ink">{formatKobo(tx.amount)}</span>
          </div>
        </div>

        {/* State banner */}
        <div className={`rounded-xl px-lg py-md text-center border anim-scale-in
          ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-hairline border-hairline'}`}
             style={{ animationDelay: '0.1s' }}>
          <p className={`font-display text-display-sm mb-xs
            ${isComplete ? 'text-emerald-700' : 'text-primary'}`}>
            {stateCopy.headline}
          </p>
          <p className={`font-body text-caption-md
            ${isComplete ? 'text-emerald-600' : 'text-ink-soft'}`}>
            {stateCopy.sub}
          </p>
        </div>

        {/* Escrow trust pills */}
        {isPayable && step === 'review' && (
          <div className="space-y-xs stagger-children">
            {[
              { icon: '🔒', text: 'Money is held securely — not sent to seller yet' },
              { icon: '✅', text: 'Funds release only when you confirm delivery' },
              { icon: '🛡️', text: 'Full dispute protection if something goes wrong' },
            ].map((p, i) => (
              <div key={p.text}
                className="anim-fade-up flex items-start gap-sm bg-canvas rounded-lg px-md py-sm
                           border border-hairline text-caption-md font-body text-ink-soft
                           hover:border-primary/20 hover:bg-cloud transition-all duration-200">
                <span className="flex-shrink-0">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pay CTA */}
        {isPayable && step === 'review' && (
          <button onClick={() => setStep('form')}
            className="btn-primary ripple-wrapper w-full flex items-center
                       justify-center gap-sm !py-md anim-fade-up"
            style={{ animationDelay: '0.15s' }}>
            <Lock size={15}/> Pay {formatKobo(tx.amount)} securely
            <ChevronRight size={15} className="ml-auto"/>
          </button>
        )}

        {/* Payment form — slides in */}
        {isPayable && step === 'form' && (
          <div className="card p-lg space-y-md anim-slide-right">
            <div>
              <p className="font-display text-display-sm text-ink mb-xs">Your details</p>
              <p className="font-body text-caption-md text-ink-soft">
                Required so the seller can confirm your order.
              </p>
            </div>
            {[
              { key: 'buyer_name',  label: 'Full name',    type: 'text',  ph: 'Ayoola Orisasona' },
              { key: 'buyer_email', label: 'Email address',type: 'email', ph: 'you@example.com' },
              { key: 'buyer_phone', label: 'Phone number', type: 'tel',   ph: '+234 800 000 0000' },
            ].map((f, i) => (
              <div key={f.key} className="anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <label className="block font-body text-caption-md text-ink font-medium mb-xs">{f.label}</label>
                <input className="input" type={f.type} placeholder={f.ph}
                       value={form[f.key]}
                       onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}/>
              </div>
            ))}
            <div className={`overflow-hidden transition-all duration-200
                             ${payError ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-red-50 border border-red-200 rounded-lg px-md py-sm
                              text-red-700 font-body text-caption-md anim-toast">
                {payError}
              </div>
            </div>
            <button onClick={handlePay} disabled={paying}
              className="btn-primary ripple-wrapper w-full flex items-center
                         justify-center gap-xs !py-md">
              {paying
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><Lock size={14}/> Confirm payment</>}
            </button>
            <button onClick={() => setStep('review')}
              className="w-full text-center font-body text-caption-sm text-ink-soft
                         hover:text-ink cursor-pointer transition-colors duration-150 py-xs
                         hover:-translate-x-1 inline-flex items-center justify-center gap-xs">
              ← Go back
            </button>
          </div>
        )}

        {/* Shipped — confirm or dispute */}
        {isShipped && !disputing && (
          <div className="space-y-sm anim-fade-up">
            <p className="font-body text-caption-md text-ink-soft text-center">
              Have you received your item?
            </p>
            <button onClick={handleConfirm} disabled={confirmed}
              className="btn-primary ripple-wrapper w-full flex items-center
                         justify-center gap-xs !py-md">
              {confirmed
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <><CheckCircle size={16}/> Yes — release payment to seller</>}
            </button>
            <button onClick={() => setDisputing(true)}
              className="w-full text-center font-body text-caption-sm text-red-500
                         hover:text-red-600 cursor-pointer transition-colors duration-150 py-xs">
              I have a problem with this order
            </button>
          </div>
        )}

        {/* Dispute form — slides in */}
        {disputing && (
          <div className="card border-red-200 p-lg space-y-md anim-slide-right">
            <p className="font-display text-display-sm text-red-600">Raise a dispute</p>
            <textarea className="input min-h-[90px] resize-none"
                      placeholder="Describe what went wrong…"
                      value={disputeReason} onChange={e => setDisputeReason(e.target.value)}/>
            <div className="flex gap-sm">
              <button onClick={() => setDisputing(false)} className="btn-ghost-dark flex-1 !py-sm">
                Cancel
              </button>
              <button onClick={handleDispute} disabled={disputeSub}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-body font-semibold
                           text-caption-md py-sm rounded-pill cursor-pointer
                           transition-all duration-200 active:scale-95">
                {disputeSub ? '…' : 'Submit dispute'}
              </button>
            </div>
          </div>
        )}

        {/* TrustFlow seal */}
        <div className="flex items-center justify-center gap-xs py-sm
                        anim-fade-up" style={{ animationDelay: '0.4s' }}>
          <Shield size={12} className="text-ink-soft"/>
          <span className="font-body text-caption-sm text-ink-soft">Secured by TrustFlow Escrow</span>
        </div>
      </div>
    </main>
  );
}
