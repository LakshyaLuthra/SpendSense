import { useState } from 'react';
import { WalletCards, ArrowRight, LockKeyhole, Mail, User } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const data = mode === 'login' ? await api.login({ email: form.email, password: form.password }) : await api.register(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return <div className="login-page">
    <section className="login-showcase"><div className="brand light"><WalletCards size={30}/><span>SpendSense</span></div><div className="showcase-copy"><span className="pill">ML-powered expense insights</span><h1>Track spending and predict what comes next.</h1><p>Your descriptions are classified by a trained model through the backend API.</p></div><div className="showcase-card"><span>Connected system</span><strong>Frontend + API + ML</strong><small>Dataset-backed category suggestions</small></div></section>
    <section className="login-panel"><form className="login-form" onSubmit={submit}>
      <p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create account'}</p><h2>{mode === 'login' ? 'Sign in to your account' : 'Start tracking expenses'}</h2>
      {mode === 'register' && <><label>Name</label><div className="input-with-icon"><User size={18}/><input required placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div></>}
      <label>Email address</label><div className="input-with-icon"><Mail size={18}/><input required type="email" placeholder="name@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
      <label>Password</label><div className="input-with-icon"><LockKeyhole size={18}/><input required minLength="6" type="password" placeholder="At least 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
      {error && <p className="error-text">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Register'} <ArrowRight size={18}/></button>
      <button type="button" className="secondary-button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create a new account':'Already have an account'}</button>
    </form></section>
  </div>;
}
