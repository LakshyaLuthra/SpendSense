import { Link } from 'react-router-dom';

const GlassIcon = ({ children, tone = 'violet' }) => (
  <div className={`landing-glass-icon ${tone}`}><span>{children}</span></div>
);

export default function Landing() {
  return (
    <main className="landing-page">
      <div className="landing-noise" />
      <div className="landing-orb landing-orb-a" />
      <div className="landing-orb landing-orb-b" />
      <div className="landing-orb landing-orb-c" />

      <div className="landing-container">
        <header className="landing-nav">
          <Link className="landing-brand" to="/">
            <span className="landing-logo">₹</span>
            <span>SpendSense</span>
          </Link>

          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#preview">AI Insights</a>
            <a href="#how">How it works</a>
          </nav>

          <div className="landing-actions">
            <Link className="landing-button landing-button-ghost" to="/login">Login</Link>
            <Link className="landing-button landing-button-primary" to="/login">Get Started</Link>
          </div>
        </header>

        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-badge"><span>✦</span> AI-POWERED MONEY INTELLIGENCE</div>

            <h1>
              Your money.
              <span className="landing-gradient-text"> Decoded.</span>
            </h1>

            <p>
              Track every expense, auto-detect categories, understand your spending
              patterns and forecast what next month could look like — in one futuristic dashboard.
            </p>

            <div className="landing-hero-actions">
              <Link className="landing-button landing-button-primary landing-button-big" to="/login">
                Launch SpendSense <span>→</span>
              </Link>
              <a className="landing-button landing-button-ghost landing-button-big" href="#features">
                Explore features
              </a>
            </div>

            <div className="landing-mini-points">
              <span>✦ Smart categories</span>
              <span>✦ ML forecasting</span>
              <span>✦ Zero spreadsheet chaos</span>
            </div>
          </div>

          <div className="landing-visual" id="preview">
            <div className="landing-dashboard">
              <div className="landing-dash-head">
                <div>
                  <small>LIVE FINANCIAL INTELLIGENCE</small>
                  <strong>Overview</strong>
                </div>
                <span className="landing-ai-pill"><i /> AI ACTIVE</span>
              </div>

              <div className="landing-stat-row">
                <article className="landing-mini-stat">
                  <span>Total Spend</span>
                  <b>₹15,545</b>
                  <small className="positive">↓ 8.4% this month</small>
                </article>
                <article className="landing-mini-stat">
                  <span>Next Month</span>
                  <b>₹13,980</b>
                  <small className="cyan-copy">ML forecast</small>
                </article>
                <article className="landing-mini-stat">
                  <span>Transactions</span>
                  <b>23</b>
                  <small>5 categories</small>
                </article>
              </div>

              <div className="landing-chart">
                <div className="landing-chart-label">
                  <span>Spending velocity</span>
                  <b>Last 6 months</b>
                </div>
                <svg viewBox="0 0 520 190" preserveAspectRatio="none" aria-label="spending trend">
                  <defs>
                    <linearGradient id="landingLine" x1="0" x2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="48%" stopColor="#ff36d4" />
                      <stop offset="100%" stopColor="#00eaff" />
                    </linearGradient>
                    <linearGradient id="landingArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".34" />
                      <stop offset="45%" stopColor="#ff36d4" stopOpacity=".12" />
                      <stop offset="100%" stopColor="#00eaff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path className="landing-area-path" d="M0,150 C58,110 97,135 150,90 S235,55 290,110 S373,122 420,72 S477,48 520,28 L520,190 L0,190 Z" fill="url(#landingArea)" />
                  <path className="landing-line-path" d="M0,150 C58,110 97,135 150,90 S235,55 290,110 S373,122 420,72 S477,48 520,28" fill="none" stroke="url(#landingLine)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="landing-float-card landing-float-one">
              <GlassIcon tone="cyan">◎</GlassIcon>
              <div><b>94% confidence</b><span>AI category match</span></div>
            </div>

            <div className="landing-float-card landing-float-two">
              <GlassIcon tone="pink">↗</GlassIcon>
              <div><b>Trend detected</b><span>Spending moving down</span></div>
            </div>
          </div>
        </section>

        <section className="landing-feature-section" id="features">
          <div className="landing-section-copy">
            <span>SMARTER BY DESIGN</span>
            <h2>Dark outside. <em>Intelligent inside.</em></h2>
            <p>Everything you need to understand your money without turning finance into homework.</p>
          </div>

          <div className="landing-feature-grid">
            <article className="landing-feature-card">
              <GlassIcon tone="violet">⚡</GlassIcon>
              <h3>Auto Categorization</h3>
              <p>Your expense description is analyzed and mapped to categories like Food, Transport, Education and more.</p>
              <span className="landing-feature-link">Category AI →</span>
            </article>

            <article className="landing-feature-card featured">
              <GlassIcon tone="pink">↗</GlassIcon>
              <h3>Next-Month Forecast</h3>
              <p>Your monthly history becomes a trend that the model can use to estimate your next month's spending.</p>
              <span className="landing-feature-link">ML prediction →</span>
            </article>

            <article className="landing-feature-card">
              <GlassIcon tone="lime">◌</GlassIcon>
              <h3>Visual Intelligence</h3>
              <p>See category splits, recent activity, totals and spending direction through a clean analytics layer.</p>
              <span className="landing-feature-link">See insights →</span>
            </article>
          </div>
        </section>

        <section className="landing-how" id="how">
          <div className="landing-how-card">
            <span className="landing-how-number">01</span>
            <div><b>Add an expense</b><small>Amount, date, mode and description.</small></div>
          </div>
          <span className="landing-connector">→</span>
          <div className="landing-how-card">
            <span className="landing-how-number">02</span>
            <div><b>AI understands it</b><small>Category prediction happens automatically.</small></div>
          </div>
          <span className="landing-connector">→</span>
          <div className="landing-how-card">
            <span className="landing-how-number">03</span>
            <div><b>Dashboard gets smarter</b><small>Your insights and forecast update with history.</small></div>
          </div>
        </section>

        <section className="landing-bottom-cta">
          <div>
            <span>READY WHEN YOU ARE</span>
            <h2>Make every rupee make sense.</h2>
          </div>
          <Link className="landing-button landing-button-primary landing-button-big" to="/login">
            Start tracking →
          </Link>
        </section>

        <footer className="landing-footer">
          <Link className="landing-brand" to="/">
            <span className="landing-logo small">₹</span><span>SpendSense</span>
          </Link>
          <span>AI Expense Intelligence • Built for smarter spending.</span>
        </footer>
      </div>
    </main>
  );
}
