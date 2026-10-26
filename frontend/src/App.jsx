import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Layout from './components/Layout';
import { api } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  const [expenses, setExpenses] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!localStorage.getItem('token')) return;
    setLoading(true);
    try {
      const [expenseData, dashboardData] = await Promise.all([api.expenses(), api.dashboard()]);
      setExpenses(expenseData);
      setDashboard(dashboardData);
    } catch (error) {
      if (error.message.toLowerCase().includes('token')) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) refresh();
  }, [isAuthenticated]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setExpenses([]);
    setDashboard(null);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout onLogout={logout} />}>
        <Route path="/dashboard" element={<Dashboard expenses={expenses} dashboard={dashboard} loading={loading} />} />
        <Route path="/add-expense" element={<AddExpense onSaved={refresh} />} />
        <Route path="/history" element={<ExpenseHistory expenses={expenses} onChanged={refresh} />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
