import { Link } from 'react-router-dom';
import { Plus, Sparkles, Tags, WalletCards, ArrowUpRight, Zap, ScanSearch, BrainCircuit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS=['#8b5cf6','#ff3bd4','#00eaff','#9cff2e','#ffb84d','#5d7cff','#ff6b7a','#21d4a7'];
const money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});

function GlowStat({icon:Icon,label,value,meta,tone='violet'}){
  return <article className={`glow-stat glow-${tone}`}>
    <div className="glow-stat-top"><span className="glass-mini-icon"><Icon size={19}/></span><span className="stat-kicker">{label}</span></div>
    <strong>{value}</strong><small>{meta}</small>
  </article>
}

export default function Dashboard({expenses,dashboard,loading}){
  const chartData=dashboard?.category_breakdown||[];
  const total=dashboard?.total_spend||0;
  const predicted=dashboard?.predicted_next_month||0;
  const transactions=expenses.length;
  const method=dashboard?.prediction_method||'Waiting for enough monthly data';

  return <div className="page-stack neon-page-stack">
    <section className="neon-hero-strip">
      <div>
        <span className="neon-kicker"><Sparkles size={14}/> AI FINANCIAL COMMAND CENTER</span>
        <h2>Your spending, <em>decoded in real time.</em></h2>
        <p>{loading?'Syncing live backend data...':'Live data from your FastAPI backend, auto-categorized and forecast with Linear Regression.'}</p>
      </div>
      <Link className="neon-primary-button" to="/add-expense"><Plus size={18}/> Add expense <ArrowUpRight size={16}/></Link>
    </section>

    <section className="glow-stats-grid">
      <GlowStat icon={WalletCards} label="Total Spend" value={money.format(total)} meta={`${transactions} saved transactions`} tone="violet"/>
      <GlowStat icon={BrainCircuit} label="Next Month Forecast" value={money.format(predicted)} meta={method} tone="pink"/>
      <GlowStat icon={Tags} label="Top Category" value={dashboard?.top_category||'No data'} meta="Largest share of spending" tone="cyan"/>
      <GlowStat icon={ScanSearch} label="Auto Category AI" value="ACTIVE" meta="Description → category" tone="lime"/>
    </section>

    <section className="neon-dashboard-grid">
      <article className="neon-panel category-orbit-panel">
        <div className="neon-panel-head"><div><span>SPENDING MAP</span><h3>Category intelligence</h3><p>Every saved expense is grouped automatically by the ML classifier.</p></div><span className="ai-chip"><Zap size={13}/> AI ACTIVE</span></div>
        <div className="donut-layout">
          <div className="donut-shell">
            {chartData.length?<ResponsiveContainer width="100%" height={330}><PieChart><Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={82} outerRadius={124} paddingAngle={4} stroke="rgba(255,255,255,.06)" strokeWidth={2}>{chartData.map((e,i)=><Cell key={e.name} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>money.format(v)} contentStyle={{background:'#090d1c',border:'1px solid rgba(255,255,255,.12)',borderRadius:14,color:'#fff'}}/></PieChart></ResponsiveContainer>:<div className="empty-neon">Add an expense to activate the chart.</div>}
            {chartData.length>0&&<div className="donut-center"><span>TOTAL</span><strong>{money.format(total)}</strong></div>}
          </div>
          <div className="category-legend-list">{chartData.slice(0,6).map((x,i)=><div className="category-legend-row" key={x.name}><i style={{background:COLORS[i%COLORS.length]}}/><span>{x.name}</span><b>{money.format(x.value)}</b></div>)}{!chartData.length&&<small>No category data yet.</small>}</div>
        </div>
      </article>

      <article className="neon-panel forecast-panel">
        <div className="neon-panel-head"><div><span>PREDICTION CORE</span><h3>Next-month forecast</h3><p>Trend-based estimation from your monthly history.</p></div></div>
        <div className="forecast-core">
          <div className="forecast-ring"><span>AI</span><strong>{predicted?money.format(predicted):'—'}</strong><small>NEXT MONTH</small></div>
          <div className="forecast-copy"><span className="signal-line"><i/> Linear Regression engine</span><h4>{predicted?'Forecast generated':'More history required'}</h4><p>{method}</p></div>
        </div>
        <div className="forecast-note"><Sparkles size={15}/> No average-of-months or +5% fallback logic is used.</div>
      </article>
    </section>

    <section className="neon-panel recent-panel neon-recent-panel">
      <div className="neon-panel-head"><div><span>LIVE FEED</span><h3>Recent expenses</h3><p>Your latest activity, with AI-detected categories.</p></div><Link className="text-link" to="/history">View full history →</Link></div>
      <div className="recent-neon-grid">{expenses.slice(0,6).map((x,i)=><article className="recent-neon-card" key={x.id}><div className="recent-icon" style={{'--accent':COLORS[i%COLORS.length]}}>{x.category?.[0]||'₹'}</div><div><b>{x.description}</b><span>{x.category} • {x.mode}</span><small>{x.date}</small></div><strong>{money.format(x.amount)}</strong></article>)}{!expenses.length&&<div className="empty-neon">No expenses yet. Add your first one.</div>}</div>
    </section>
  </div>
}
