import { Link } from 'react-router-dom';
import { ArrowRight, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TrustBadge from '../components/ui/TrustBadge';

/* ── Intersection observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Animated counter ── */
function Counter({ target, suffix = '', duration = 1200 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const STEPS = [
  { n: '01', title: 'Generate a secure link',  body: 'Create a TrustFlow checkout in seconds. Share it on WhatsApp, Instagram, or anywhere you sell.' },
  { n: '02', title: 'Buyer pays into escrow',  body: 'Funds are held securely by TrustFlow. The seller\'s verified badge gives the buyer confidence to pay.' },
  { n: '03', title: 'Seller ships the item',   body: 'Seller dispatches knowing payment is guaranteed and held safely in escrow.' },
  { n: '04', title: 'Confirm and release',     body: 'One tap confirms delivery. Funds release instantly to the seller. Both parties leave a review.' },
];

const TIERS = [
  { tier: 'BRONZE',   range: '0–4 sales',   perk: 'Platform-backed escrow protection on every order' },
  { tier: 'SILVER',   range: '5–19 sales',  perk: 'Verified seller badge displayed on checkout' },
  { tier: 'GOLD',     range: '20–49 sales', perk: 'Priority dispute resolution and merchant support' },
  { tier: 'PLATINUM', range: '50+ sales',   perk: 'Featured merchant status across the platform' },
];

export default function Landing() {
  const [stepsRef, stepsInView] = useInView();
  const [tiersRef, tiersInView] = useInView();
  const [ctaRef,   ctaInView]   = useInView();
  const [mockRef,  mockInView]  = useInView();

  return (
    <main className="pt-20">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="band-dark relative overflow-hidden min-h-[90vh] flex items-center">

        {/* Animated SVG network graphic */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute right-0 top-0 w-[700px] h-[700px] opacity-[0.07]"
               viewBox="0 0 700 700" fill="none">
            <circle cx="580" cy="120" r="350" stroke="#10d1b7" strokeWidth="0.6"
                    className="anim-draw-path" style={{ animationDelay: '0.2s' }}/>
            <circle cx="580" cy="120" r="230" stroke="#10d1b7" strokeWidth="0.6"
                    className="anim-draw-path" style={{ animationDelay: '0.5s' }}/>
            <circle cx="580" cy="120" r="110" stroke="#10d1b7" strokeWidth="0.6"
                    className="anim-draw-path" style={{ animationDelay: '0.8s' }}/>
            <line x1="200" y1="0" x2="700" y2="500" stroke="#0a71ac" strokeWidth="0.4"
                  className="anim-draw-path" style={{ animationDelay: '0.3s' }}/>
            <line x1="80"  y1="150" x2="700" y2="700" stroke="#0a71ac" strokeWidth="0.4"
                  className="anim-draw-path" style={{ animationDelay: '0.6s' }}/>
            <line x1="0"   y1="300" x2="600" y2="800" stroke="#10d1b7" strokeWidth="0.4"
                  className="anim-draw-path" style={{ animationDelay: '0.9s' }}/>
          </svg>
        </div>

        <div className="container-content py-section relative z-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="anim-fade-up inline-flex items-center gap-2 bg-white/5
                            border border-white/10 rounded-pill px-md py-xs mb-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-glow anim-pulse-dot"/>
              <span className="text-accent-glow font-body text-caption-md">
                Built for African social commerce
              </span>
            </div>

            {/* Headline — staggered words */}
            <h1 className="font-display text-display-xl text-white leading-[1.05] mb-lg">
              <span className="anim-fade-up block" style={{ animationDelay: '0.1s' }}>
                Trade without
              </span>
              <span className="anim-fade-up block" style={{ color: '#10d1b7', animationDelay: '0.25s' }}>
                the fear.
              </span>
            </h1>

            <p className="anim-fade-up font-body text-body-lg text-white/60 max-w-xl mb-xxl leading-relaxed"
               style={{ animationDelay: '0.35s' }}>
              TrustFlow holds your money in escrow until the item arrives.
              Buyers pay with confidence. Sellers ship knowing funds are secured.
            </p>

            <div className="anim-fade-up flex flex-col sm:flex-row gap-md"
                 style={{ animationDelay: '0.45s' }}>
              <Link to="/auth?tab=register"
                className="btn-primary ripple-wrapper inline-flex items-center justify-center gap-2">
                Start selling free <ArrowRight size={15}/>
              </Link>
              <a href="#how-it-works"
                className="btn-ghost inline-flex items-center justify-center gap-2">
                See how it works <ChevronRight size={15}/>
              </a>
            </div>
          </div>

          {/* Stats — animated counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mt-xxl pt-xxl
                          border-t border-white/10 stagger-children">
            {[
              { value: 7,   suffix: 'B+', prefix: '$', label: 'Social commerce market in Africa' },
              { value: 40,  suffix: '%',  prefix: '', label: 'Transactions complete without trust issues' },
              { value: 4,   suffix: '',   prefix: '',  label: 'Steps to a fully protected transaction' },
            ].map((s, i) => (
              <div key={i} className="anim-fade-up" style={{ animationDelay: `${0.55 + i * 0.1}s` }}>
                <p className="font-display text-display-md text-white mb-xs">
                  {s.prefix}<Counter target={s.value} suffix={s.suffix} duration={1000 + i * 200}/>
                </p>
                <p className="font-body text-caption-md text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="band-light py-section">
        <div className="container-content">
          <div className="max-w-2xl mb-xxl">
            <p className="anim-fade-up font-body text-caption-md text-primary font-semibold
                          uppercase tracking-widest mb-sm">The process</p>
            <h2 className="anim-fade-up font-display text-display-lg text-ink mb-lg"
                style={{ animationDelay: '0.1s' }}>
              Four steps. Zero risk.
            </h2>
            <p className="anim-fade-up font-body text-body-lg text-ink-soft"
               style={{ animationDelay: '0.2s' }}>
              Every TrustFlow transaction is protected by our escrow engine.
              Funds only move when both parties are satisfied.
            </p>
          </div>

          <div ref={stepsRef} className="grid md:grid-cols-2 gap-lg stagger-children">
            {STEPS.map((s, i) => (
              <div key={s.n}
                className={`card card-hover p-lg group cursor-default ripple-wrapper
                            ${stepsInView ? 'anim-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="font-display text-display-md text-primary/20 font-semibold
                                 block mb-md group-hover:text-primary/50
                                 transition-colors duration-300">
                  {s.n}
                </span>
                <h3 className="font-display text-display-sm text-ink mb-sm
                               group-hover:text-primary transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="font-body text-body-md text-ink-soft leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOCK CHECKOUT ─────────────────────────────────────────────────── */}
      <section className="band-paper py-section">
        <div className="container-content">
          <div ref={mockRef} className="grid lg:grid-cols-2 gap-xxl items-center">

            {/* Copy */}
            <div className={mockInView ? 'anim-slide-left' : 'opacity-0'}>
              <p className="font-body text-caption-md text-primary font-semibold
                            uppercase tracking-widest mb-sm">The buyer experience</p>
              <h2 className="font-display text-display-lg text-ink mb-lg">
                A checkout that earns trust before the sale.
              </h2>
              <p className="font-body text-body-lg text-ink-soft mb-xxl">
                When a buyer clicks your TrustFlow link, they see your verified identity,
                your Trust Score, and escrow protection before paying a single naira.
              </p>
              <div className="space-y-md stagger-children">
                {['Seller verified by TrustFlow', 'Funds held in escrow — not with seller', 'Dispute protection if anything goes wrong'].map((f, i) => (
                  <div key={f}
                    className={`flex items-center gap-sm ${mockInView ? 'anim-fade-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                    <CheckCircle size={18} className="text-primary flex-shrink-0"/>
                    <span className="font-body text-body-md text-ink">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating mock card */}
            <div className={`${mockInView ? 'anim-slide-right' : 'opacity-0'}`}
                 style={{ animationDelay: '0.1s' }}>
              <div className="card p-lg max-w-sm mx-auto w-full anim-float">
                <div className="flex items-center justify-between mb-lg">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center
                                    transition-transform duration-300 hover:scale-110">
                      <Shield size={14} className="text-white"/>
                    </div>
                    <div>
                      <p className="font-display text-caption-md text-ink font-semibold">Demo Merchant</p>
                      <div className="anim-badge-pop" style={{ animationDelay: '0.4s' }}>
                        <TrustBadge tier="GOLD" size="sm"/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-hairline pt-lg mb-lg space-y-sm">
                  {[
                    { label: 'Item',    val: 'Nike Air Force 1' },
                    { label: 'Escrow', val: 'Protected ✓', color: 'text-primary' },
                  ].map((r, i) => (
                    <div key={r.label}
                      className={`flex justify-between ${mockInView ? 'anim-fade-up' : 'opacity-0'}`}
                      style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                      <span className="font-body text-caption-md text-ink-soft">{r.label}</span>
                      <span className={`font-body text-caption-md font-medium ${r.color || 'text-ink'}`}>
                        {r.val}
                      </span>
                    </div>
                  ))}
                  <div className={`flex justify-between border-t border-hairline pt-sm mt-sm
                                   ${mockInView ? 'anim-fade-up' : 'opacity-0'}`}
                       style={{ animationDelay: '0.5s' }}>
                    <span className="font-body text-caption-md text-ink-soft">Total</span>
                    <span className="font-display text-display-sm text-ink">₦ 65,000</span>
                  </div>
                </div>

                <button className="btn-primary ripple-wrapper w-full flex items-center
                                   justify-center gap-2">
                  <Shield size={14}/> Pay into Escrow
                </button>
                <p className="text-center font-body text-caption-sm text-ink-soft mt-sm">
                  Secured by TrustFlow · Funds held until delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST TIERS ───────────────────────────────────────────────────── */}
      <section className="band-dark py-section">
        <div className="container-content">
          <div className="text-center max-w-2xl mx-auto mb-xxl">
            <p className="anim-fade-up font-body text-caption-md text-accent-glow font-semibold
                          uppercase tracking-widest mb-sm">Reputation system</p>
            <h2 className="anim-fade-up font-display text-display-lg text-white mb-lg"
                style={{ animationDelay: '0.1s' }}>
              Your trust grows with every delivery.
            </h2>
            <p className="anim-fade-up font-body text-body-lg text-white/60"
               style={{ animationDelay: '0.2s' }}>
              New merchants start at Bronze. Our escrow protection means buyers purchase
              from you on day one your tier advances with every successful sale.
            </p>
          </div>

          <div ref={tiersRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-lg stagger-children">
            {TIERS.map(({ tier, range, perk }, i) => (
              <div key={tier}
                className={`bg-white/5 border border-white/10 rounded-xl p-lg cursor-default
                            hover:bg-white/10 hover:-translate-y-2 hover:border-white/20
                            transition-all duration-300
                            ${tiersInView ? 'anim-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="anim-badge-pop" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  <TrustBadge tier={tier} size="md"/>
                </div>
                <p className="font-body text-caption-sm text-white/40 mt-sm mb-md">{range}</p>
                <p className="font-body text-body-md text-white/70 leading-relaxed">{perk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="band-light py-section">
        <div ref={ctaRef} className="container-content text-center">
          <h2 className={`font-display text-display-lg text-ink mb-lg max-w-2xl mx-auto
                          ${ctaInView ? 'anim-fade-up' : 'opacity-0'}`}>
            Ready to sell with confidence?
          </h2>
          <p className={`font-body text-body-lg text-ink-soft mb-xxl max-w-xl mx-auto
                         ${ctaInView ? 'anim-fade-up' : 'opacity-0'}`}
             style={{ animationDelay: '0.1s' }}>
            Join merchants across Nigeria using TrustFlow to close more sales, faster.
          </p>
          <div className={ctaInView ? 'anim-scale-in' : 'opacity-0'}
               style={{ animationDelay: '0.2s' }}>
            <Link to="/auth?tab=register"
              className="btn-primary ripple-wrapper inline-flex items-center gap-2 text-base">
              Create your free account <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="band-dark border-t border-white/10 py-xxl">
        <div className="container-content flex flex-col sm:flex-row items-center
                        justify-between gap-md">
          <div className="flex items-center gap-sm hover-lift cursor-pointer">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Shield size={12} className="text-white"/>
            </div>
            <span className="font-display font-semibold text-white text-sm">TrustFlow</span>
          </div>
          <p className="font-body text-caption-sm text-white/30">
            © 2025 TrustFlow · Obafemi Awolowo University · Ile-Ife, Nigeria
          </p>
          <p className="font-body text-caption-sm text-white/30">
            Escrow-protected commerce infrastructure
          </p>
        </div>
      </footer>
    </main>
  );
}
