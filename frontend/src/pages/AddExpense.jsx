import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, RotateCcw, Sparkles, ScanSearch, IndianRupee, CalendarDays, CreditCard, WandSparkles, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

const empty={amount:'',description:'',date:new Date().toISOString().slice(0,10),mode:'UPI'};

export default function AddExpense({onSaved}){
  const[form,setForm]=useState(empty);const[error,setError]=useState('');const[suggestion,setSuggestion]=useState(null);const[busy,setBusy]=useState(false);const timer=useRef();const navigate=useNavigate();
  const update=e=>{const next={...form,[e.target.name]:e.target.value};setForm(next);if(e.target.name==='description'){clearTimeout(timer.current);setSuggestion(null);if(next.description.trim().length>=3){timer.current=setTimeout(async()=>{try{setSuggestion(await api.predictCategory({description:next.description,amount:Number(next.amount)||0,mode:next.mode}))}catch{}},450)}}};
  const submit=async e=>{e.preventDefault();setError('');setBusy(true);try{await api.addExpense({...form,amount:Number(form.amount)});await onSaved();navigate('/history')}catch(err){setError(err.message)}finally{setBusy(false)}};

  return <div className="page-stack neon-page-stack add-expense-page">
    <section className="neon-hero-strip compact-hero"><div><span className="neon-kicker"><WandSparkles size={14}/> SMART INPUT</span><h2>Add expense. <em>AI does the sorting.</em></h2><p>No category dropdown. Describe the expense and the model detects the category automatically.</p></div><span className="ai-chip"><ShieldCheck size={14}/> BACKEND VERIFIED</span></section>

    <section className="add-expense-layout">
      <article className="neon-panel expense-entry-panel">
        <div className="neon-panel-head"><div><span>NEW TRANSACTION</span><h3>Expense details</h3><p>Fill the essentials. Category intelligence runs in the background.</p></div></div>
        <form className="neon-expense-form" onSubmit={submit}>
          <div className="neon-field-grid">
            <label className="neon-field"><span><IndianRupee size={15}/> Amount</span><div className="neon-input-shell"><b>₹</b><input required name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={update}/></div></label>
            <label className="neon-field"><span><CalendarDays size={15}/> Date</span><input required name="date" type="date" value={form.date} onChange={update}/></label>
            <label className="neon-field full"><span><ScanSearch size={15}/> Description</span><textarea required name="description" rows="5" placeholder="Example: Uber ride to college" value={form.description} onChange={update}/><small>Be descriptive — better text gives the category model more context.</small></label>
            <label className="neon-field"><span><CreditCard size={15}/> Payment mode</span><select name="mode" value={form.mode} onChange={update}><option>UPI</option><option>Cash</option><option>Card</option><option>Net Banking</option><option>Wallet</option></select></label>
          </div>
          {error&&<p className="error-text neon-error">{error}</p>}
          <div className="form-actions neon-form-actions"><button type="button" className="neon-secondary-button" onClick={()=>{setForm(empty);setSuggestion(null)}}><RotateCcw size={17}/> Reset</button><button className="neon-primary-button" disabled={busy}><Save size={17}/>{busy?'Saving...':'Save expense'}</button></div>
        </form>
      </article>

      <aside className="neon-panel ai-scanner-panel">
        <div className="scanner-orb"><ScanSearch size={42}/><span className="scan-line"/></div>
        <span className="neon-kicker">CATEGORY SCANNER</span>
        <h3>{suggestion?.category||'Waiting for description'}</h3>
        {suggestion?<><div className="confidence-meter"><span style={{width:`${Math.round(suggestion.confidence*100)}%`}}/></div><p><b>{Math.round(suggestion.confidence*100)}%</b> confidence</p><small>Prediction will be verified again by the backend when you save.</small></>:<><p>Start typing an expense description to see the AI category prediction.</p><small>Examples: “metro recharge”, “pizza dinner”, “course fee”.</small></>}
        <div className="scanner-points"><span><Sparkles size={14}/> Auto-detected category</span><span><ShieldCheck size={14}/> Saved by backend</span><span><WandSparkles size={14}/> No manual category selection</span></div>
      </aside>
    </section>
  </div>
}
