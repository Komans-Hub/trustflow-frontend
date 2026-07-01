import { Link } from 'react-router-dom';
import { Shield, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';
import TrustBadge from '../components/ui/TrustBadge';

const STEPS = [
  { n: '01', title: 'Seller generates a link',  body: 'Create a secure TrustFlow checkout in seconds. Share it anywhere — WhatsApp, Instagram, X.' },
  { n: '02', title: 'Buyer pays into escrow',    body: 'Funds are held securely. The seller\'s Trust Score and verified badge give the buyer confidence to pay.' },
  { n: '03', title: 'Seller ships the item',     body: 'The seller dispatches the order knowing payment is guaranteed and waiting.' },
  { n: '04', title: 'Buyer confirms, funds release', body: 'One tap confirms delivery. Funds go straight to the seller. Both parties leave a review.' },
];

const TIERS = [
  { tier: 'BRONZE',   range: '0–4 sales',    perk: 'Platform-backed escrow protection' },
  { tier: 'SILVER',   range: '5–19 sales',   perk: 'Verified seller badge on checkout' },
  { tier: 'GOLD',     range: '20–49 sales',  perk: 'Priority dispute resolution' },
  { tier: 'PLATINUM', range: '50+ sales',    perk: 'Featured merchant status' },
];

export default function Landing() {
  return (
    <main className="pt-16">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[600px] rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 border border-cyan/20 bg-cyan/5
                          rounded-full px-4 py-1.5 text-cyan text-sm font-body mb-8">
            <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-pulse-slow" />
            Built for African social commerce
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6">
            Trade without
            <br />
            <span className="text-gradient">the fear.</span>
          </h1>

          <p className="font-body text-white/50 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            TrustFlow holds your money in escrow until the item arrives.
            Buyers pay with confidence. Sellers ship knowing funds are secured.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth?tab=register" className="btn-primary flex items-center justify-center gap-2 text-base">
              Start selling <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-ghost flex items-center justify-center gap-2 text-base">
              See how it works
            </a>
          </div>
        </div>

        {/* Floating mock checkout card */}
        <div className="relative mt-20 w-full max-w-sm mx-auto animate-fade-up"
             style={{ animationDelay: '0.2s' }}>
          <div className="card border-glow p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-semibold text-sm text-white/40 uppercase tracking-widest">
                Secure Checkout
              </span>
              <TrustBadge tier="GOLD" size="sm" />
            </div>
            <p className="font-display font-semibold text-lg mb-1">Nike Air Force 1 '07</p>
            <p className="font-mono text-cyan text-2xl font-bold mb-4">₦ 65,000</p>
            <div className="space-y-2 mb-5">
              {['Phone verified', 'Email verified', 'Escrow protected'].map(l => (
                <div key={l} className="flex items-center gap-2 text-sm text-white/50">
                  <CheckCircle size={13} className="text-cyan flex-shrink-0" />
                  {l}
                </div>
              ))}
            </div>
            <button className="btn-primary w-full text-sm">Pay into Escrow</button>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-8 blur-2xl opacity-30 rounded-full"
               style={{ background: '#22D3EE' }} />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-cyan font-mono text-sm mb-3">The process</p>
          <h2 className="font-display font-bold text-4xl">Four steps. Zero risk.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6 flex gap-4 group hover:border-cyan/20 transition-colors">
              <span className="font-mono text-cyan/40 text-sm font-bold pt-0.5 flex-shrink-0 group-hover:text-cyan/70 transition-colors">
                {s.n}
              </span>
              <div>
                <h3 className="font-display font-semibold text-base mb-1.5">{s.title}</h3>
                <p className="font-body text-white/40 text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Tiers ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: 'rgba(13,20,38,0.6)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan font-mono text-sm mb-3">Reputation system</p>
            <h2 className="font-display font-bold text-4xl mb-4">Your trust grows with you</h2>
            <p className="text-white/40 font-body max-w-md mx-auto">
              New merchants start at Bronze. Our escrow protection means buyers still purchase
              from you — your tier improves with every successful delivery.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map(({ tier, range, perk }) => (
              <div key={tier} className="card p-5 flex flex-col gap-3 hover:border-white/10 transition-colors">
                <TrustBadge tier={tier} size="md" />
                <p className="font-mono text-xs text-white/30">{range}</p>
                <p className="font-body text-sm text-white/50 leading-relaxed">{perk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display font-bold text-4xl mb-4">
            Ready to sell with confidence?
          </h2>
          <p className="text-white/40 font-body mb-8">
            Join merchants across Nigeria using TrustFlow to close more sales, faster.
          </p>
          <Link to="/auth?tab=register" className="btn-primary inline-flex items-center gap-2 text-base">
            Create your merchant account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-white/20 font-mono text-xs">
          © 2025 TrustFlow · Built at OAU · Escrow-protected commerce infrastructure
        </p>
      </footer>
    </main>
  );
}
