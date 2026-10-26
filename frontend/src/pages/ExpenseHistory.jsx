import { useMemo,useState } from 'react';
import { Search,Trash2,ReceiptText,Filter,Layers3,WalletCards,Sparkles } from 'lucide-react';
import { api } from '../services/api';
const money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});

export default function ExpenseHistory({expenses,onChanged}){
  const[search,setSearch]=useState('');const[category,setCategory]=useState('All');const[error,setError]=useState('');
  const categories=['All',...new Set(expenses.map(x=>x.category))];
  const filtered=useMemo(()=>expenses.filter(x=>x.description.toLowerCase().includes(search.toLowerCase())&&(category==='All'||x.category===category)),[expenses,search,category]);
  const remove=async id=>{try{await api.deleteExpense(id);await onChanged()}catch(e){setError(e.message)}};
  const filteredTotal=filtered.reduce((sum,x)=>sum+Number(x.amount||0),0);

  return <div className="page-stack neon-page-stack history-page">
    <section className="neon-hero-strip compact-hero"><div><span className="neon-kicker"><ReceiptText size={14}/> TRANSACTION VAULT</span><h2>Expense history, <em>but make it futuristic.</em></h2><p>Search, filter and inspect every backend-saved transaction.</p></div><span className="ai-chip"><Sparkles size={14}/> {expenses.length} RECORDS</span></section>

    <section className="history-summary-grid">
      <article className="history-summary-card"><span><WalletCards size={17}/> Visible spend</span><strong>{money.format(filteredTotal)}</strong><small>Based on current filters</small></article>
      <article className="history-summary-card"><span><Layers3 size={17}/> Transactions</span><strong>{filtered.length}</strong><small>Matching records</small></article>
      <article className="history-summary-card"><span><Filter size={17}/> Categories</span><strong>{Math.max(categories.length-1,0)}</strong><small>Detected by ML</small></article>
    </section>

    <article className="neon-panel history-panel">
      <div className="history-toolbar"><div className="neon-search"><Search size={18}/><input placeholder="Search expense description..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="filter-select-wrap"><Filter size={16}/><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></div></div>
      {error&&<p className="error-text neon-error">{error}</p>}
      <div className="history-table-wrap"><table className="neon-table"><thead><tr><th>Date</th><th>Description</th><th>AI Category</th><th>Mode</th><th>Amount</th><th></th></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td><span className="date-chip">{x.date}</span></td><td><strong>{x.description}</strong></td><td><span className="neon-tag">{x.category}</span></td><td>{x.mode}</td><td className="amount-cell">{money.format(x.amount)}</td><td><button className="neon-delete" onClick={()=>remove(x.id)} aria-label="Delete expense"><Trash2 size={16}/></button></td></tr>)}{!filtered.length&&<tr><td colSpan="6"><div className="empty-neon">No matching expenses found.</div></td></tr>}</tbody></table></div>
    </article>
  </div>
}
