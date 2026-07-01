import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck, AlertTriangle, Shield } from 'lucide-react';
import api from '../api/client';

const STEPS = [
  { state: 'CREATED',   label: 'Order created',      icon: Clock        },
  { state: 'PAID',      label: 'Payment in escrow',  icon: Shield       },
  { state: 'SHIPPED',   label: 'Item shipped',        icon: Truck        },
  { state: 'RELEASED',  label: 'Funds released',      icon: CheckCircle  },
];

const STATE_ORDER = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'RELEASED'];

function formatKobo(k) {
  return `₦ ${(Number(k) / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

export default function TransactionStatus() {
  const { id } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    // This reuses the checkout token endpoint if an id is actually a token
    // For the status page we pass the transaction token via the URL
    api.get(`/transactions/${id}`)
      .then(res => setData(res.data))
      .catch(() => setError('Transaction not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-white/10 border-t-cyan rounded-full animate-spin" />
    </main>
  );

  if (error || !data) return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <AlertTriangle size={36} className="text-red-400 mx-auto mb-3" />
        <p className="font-display font-semibold">{error || 'Not found'}</p>
      </div>
    </main>
  );

  const { transaction: tx, seller } = data;
  const isDisputed = tx.state === 'DISPUTED';
  const currentIdx = STATE_ORDER.indexOf(tx.state);

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-sm space-y-5 animate-fade-up">

        <div className="text-center mb-2">
          <p className="text-white/30 font-mono text-xs mb-1">Transaction status</p>
          <h1 className="font-display font-bold text-xl truncate">{tx.item_description}</h1>
          <p className="font-mono text-cyan text-lg mt-1">{formatKobo(tx.amount)}</p>
        </div>

        {/* Progress timeline */}
        {!isDisputed ? (
          <div className="card p-6">
            <div className="space-y-5">
              {STEPS.map((s, i) => {
                const done   = currentIdx >= STATE_ORDER.indexOf(s.state);
                const active = STATE_ORDER[currentIdx] === s.state;
                const Icon   = s.icon;
                return (
                  <div key={s.state} className="flex items-center gap-4">
                    {/* Step indicator */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${done
                        ? 'bg-cyan/20 border border-cyan/50'
                        : 'bg-white/5 border border-white/10'}`}>
                      <Icon size={15} className={done ? 'text-cyan' : 'text-white/20'} />
                    </div>

                    <div className="flex-1">
                      <p className={`font-display font-medium text-sm
                        ${active ? 'text-white' : done ? 'text-white/60' : 'text-white/20'}`}>
                        {s.label}
                      </p>
                      {active && (
                        <p className="text-cyan text-xs font-mono mt-0.5">Current step</p>
                      )}
                    </div>

                    {done && <CheckCircle size={14} className="text-cyan flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card border-red-500/20 p-6 text-center">
            <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="font-display font-semibold text-red-400 mb-1">Dispute raised</p>
            <p className="text-white/30 text-sm font-body">{tx.dispute_reason}</p>
          </div>
        )}

        {/* Seller info */}
        <div className="card p-4 flex items-center gap-3">
          <Shield size={16} className="text-cyan flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-white/30 font-body">Seller</p>
            <p className="font-display font-medium text-sm truncate">{seller?.name}</p>
          </div>
          <span className="ml-auto font-mono text-xs text-white/20">
            {tx.state}
          </span>
        </div>

        <a href={`/checkout/${id}`}
          className="btn-ghost w-full text-center text-sm flex items-center justify-center">
          Open checkout page
        </a>
      </div>
    </main>
  );
}
