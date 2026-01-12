import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

// Use localhost for dev. In prod this would be an env var.
const API_URL = 'http://localhost:5500/api/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'debit',
    description: ''
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate summary
  const income = transactions
    .filter(t => t.type === 'credit')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    try {
      await axios.post(API_URL, formData);
      setFormData({ amount: '', type: 'debit', description: '' });
      fetchTransactions();
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <div className="container">
      {/* Left Col: Dashboard & Form */}
      <div>
        <div className="glass summary-card" style={{ marginBottom: '2rem' }}>
          <div className="summary-label">Total Balance</div>
          <div className="summary-amount">${balance.toFixed(2)}</div>
          <div className="dashboard-grid" style={{ marginBottom: 0, marginTop: '1rem' }}>
            <div>
              <div className="summary-label">Income</div>
              <div className="summary-amount income-text">+${income.toFixed(2)}</div>
            </div>
            <div>
              <div className="summary-label">Expense</div>
              <div className="summary-amount expense-text">-${expense.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <form className="glass form-section" onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1rem' }}>Add Transaction</h3>

          <div className="type-selector">
            <div
              className={`type-btn ${formData.type === 'credit' ? 'active credit' : ''}`}
              onClick={() => handleTypeChange('credit')}
            >
              Credit
            </div>
            <div
              className={`type-btn ${formData.type === 'debit' ? 'active debit' : ''}`}
              onClick={() => handleTypeChange('debit')}
            >
              Debit
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              className="form-input"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Salary, Groceries"
            />
          </div>

          <button type="submit" className="submit-btn">Add Transaction</button>
        </form>
      </div>

      {/* Right Col: History */}
      <div className="glass history-section">
        <div className="history-header">
          <h3>Recent Transactions</h3>
        </div>

        <div className="transaction-list">
          {transactions.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="t-info">
                <span className="t-desc">{t.description || 'No Description'}</span>
                <span className="t-date">{new Date(t.date).toLocaleDateString()}</span>
              </div>
              <div className="t-amount">
                <span className={t.type === 'credit' ? 'income-text' : 'expense-text'}>
                  {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(t.id)} title="Delete">
                  🗑
                </button>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No transactions yet. Start adding some!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
