import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ReceiptText, LogOut, WalletCards, Sparkles } from 'lucide-react';

const links=[
  {to:'/dashboard',label:'Dashboard',icon:LayoutDashboard},
  {to:'/add-expense',label:'Add Expense',icon:PlusCircle},
  {to:'/history',label:'Expense History',icon:ReceiptText}
];

export default function Layout({onLogout}){
  const user=JSON.parse(localStorage.getItem('user')||'{}');
  const initials=(user.name||'User').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
  return (
    <div className="app-shell neon-app-shell">
      <div className="app-orb app-orb-one" />
      <div className="app-orb app-orb-two" />
      <aside className="sidebar neon-sidebar">
        <div className="brand neon-brand"><span className="brand-cube"><WalletCards size={23}/></span><span>SpendSense</span></div>
        <div className="sidebar-ai"><Sparkles size={14}/><span>AI MONEY OS</span></div>
        <nav>{links.map(({to,label,icon:Icon})=><NavLink key={to} to={to} className={({isActive})=>`nav-link ${isActive?'active':''}`}><span className="nav-icon"><Icon size={19}/></span><span>{label}</span></NavLink>)}</nav>
        <div className="sidebar-foot">
          <div className="mini-status"><i/><div><b>Prediction engine</b><span>Linear Regression ready</span></div></div>
          <button className="logout-button" onClick={onLogout}><LogOut size={18}/>Logout</button>
        </div>
      </aside>
      <main className="main-content neon-main">
        <header className="topbar neon-topbar">
          <div><p className="eyebrow">PERSONAL FINANCE INTELLIGENCE</p><h1>Welcome back, {user.name||'User'}</h1></div>
          <div className="topbar-right"><span className="live-pill"><i/> LIVE</span><div className="avatar neon-avatar">{initials}</div></div>
        </header>
        <Outlet/>
      </main>
    </div>
  );
}
