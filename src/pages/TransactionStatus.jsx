import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Truck, AlertTriangle, Shield } from 'lucide-react';
import api from '../api/client';

const STEPS = [
  { state: 'CREATED',  label: 'Order created',     icon: Clock        },
  { state: 'PAID',     label: 'Payment in escrow', icon: Shield       },
  { state: 'SHIPPED',  label: 'Item shipped',       icon: Truck        },
  { state: 'RELEASED', label: 'Funds released',     icon: CheckCircle  },
];
const STATE_ORDER = ['CREATED','PAID','SHIPPED','DELIVERED','RELEASED'];

function formatKobo(k) {
  return `₦ ${(Number(k)/100).toLocaleString('en-NG',{minimumFractionDigits:0})}`;
}

export default function TransactionStatus() {
  const { id } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get(`/transactions/${id}`)
      .then(res => setData(res.data))
      .catch(() => setError('Transaction not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="min-h-screen bg-cloud flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-hairline border-t-primary rounded-full animate-spin"/>
    </main>
  );

  if (error || !data) return (
    <main className="min-h-screen bg-cloud flex items-center justify-center px-lg">
      <div className="text-center">
        <AlertTriangle size={36} className="text-red-400 mx-auto mb-md"/>
        <p className="font-display text-display-sm text-ink">{error || 'Not found'}</p>
      </div>
    </main>
  );

  const { transaction: tx, seller } = data;
  const isDisputed = tx.state === 'DISPUTED';
  const currentIdx = STATE_ORDER.indexOf(tx.state);

  return (
    <main className="min-h-screen bg-cloud pt-28 pb-section px-lg flex flex-col items-center">
      <div className="w-full max-w-sm space-y-md animate-fade-up">

        <div className="text-center mb-md">
          <p className="font-body text-caption-md text-ink-soft mb-xs">Transaction status</p>
          <h1 className="font-display text-display-sm text-ink truncate">{tx.item_description}</h1>
          <p className="font-display text-display-md text-primary mt-xs">{formatKobo(tx.amount)}</p>
        </div>

        {/* Progress timeline */}
        {!isDisputed ? (
          <div className="card p-lg">
            <div className="space-y-lg">
              {STEPS.map((s, i) => {
                const done   = currentIdx >= STATE_ORDER.indexOf(s.state);
                const active = STATE_ORDER[currentIdx] === s.state;
                const Icon   = s.icon;
                return (
                  <div key={s.state} className="flex items-center gap-md">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                    flex-shrink-0 transition-all duration-base
                                    ${done ? 'bg-hairline' : 'bg-cloud border border-hairline'}`}>
                      <Icon size={16} className={done ? 'text-primary' : 'text-ink-soft'}/>
                    </div>
                    <div className="flex-1">
                      <p className={`font-body font-medium text-body-md transition-colors duration-base
                        ${active ? 'text-ink' : done ? 'text-ink-soft' : 'text-ink-soft/50'}`}>
                        {s.label}
                      </p>
                      {active && (
                        <p className="font-body text-caption-sm text-primary mt-xs">Current step</p>
                      )}
                    </div>
                    {done && <CheckCircle size={15} className="text-primary flex-shrink-0"/>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card border-red-200 p-lg text-center">
            <AlertTriangle size={32} className="text-red-400 mx-auto mb-md"/>
            <p className="font-display text-display-sm text-red-600 mb-xs">Dispute raised</p>
            <p className="font-body text-caption-md text-ink-soft">{tx.dispute_reason}</p>
          </div>
        )}

        {/* Seller info */}
        <div className="card p-md flex items-center gap-md">
          <Shield size={16} className="text-primary flex-shrink-0"/>
          <div className="min-w-0 flex-1">
            <p className="font-body text-caption-sm text-ink-soft">Seller</p>
            <p className="font-body font-medium text-body-md text-ink truncate">{seller?.name}</p>
          </div>
          <span className="font-body text-caption-sm text-ink-soft bg-cloud
                           px-sm py-xs rounded-pill border border-hairline">
            {tx.state}
          </span>
        </div>

        <a href={`/checkout/${id}`}
          className="btn-ghost-dark w-full text-center flex items-center justify-center !py-sm">
          Open checkout page
        </a>
      </div>
    </main>
  );
}
