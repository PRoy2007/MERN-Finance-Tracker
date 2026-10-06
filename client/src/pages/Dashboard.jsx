import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../authContext';

const emptyForm = { type: 'expense', amount: '', category: '', description: '', date: '' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/transactions')
      .then(({ data }) => setTransactions(data))
      .catch((err) => {
        if (err.response?.status === 401) logout();
        else setError('Could not load transactions');
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/transactions', { ...form, amount: Number(form.amount) });
      setTransactions((prev) =>
        [data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError('Could not delete transaction');
    }
  };

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="dashboard">
      <header>
        <h2>Hi, {user?.name}</h2>
        <button onClick={logout}>Log Out</button>
      </header>

      <div className="summary">
        <div className="card"><span>Balance</span><strong>{fmt(income - expenses)}</strong></div>
        <div className="card income"><span>Income</span><strong>{fmt(income)}</strong></div>
        <div className="card expense"><span>Expenses</span><strong>{fmt(expenses)}</strong></div>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="tx-form" onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input name="amount" type="number" step="0.01" min="0.01" placeholder="Amount"
          value={form.amount} onChange={handleChange} required />
        <input name="category" placeholder="Category (e.g. Food)"
          value={form.category} onChange={handleChange} required />
        <input name="description" placeholder="Description (optional)"
          value={form.description} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      {transactions.length === 0 ? (
        <p className="empty">No transactions yet. Add one above.</p>
      ) : (
        <ul className="tx-list">
          {transactions.map((t) => (
            <li key={t._id} className={t.type}>
              <div>
                <strong>{t.category}</strong>
                {t.description && <span> · {t.description}</span>}
                <small>{new Date(t.date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</small>
              </div>
              <div className="tx-right">
                <span className="amount">
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button onClick={() => handleDelete(t._id)}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}