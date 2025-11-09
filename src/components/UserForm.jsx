import React, { useState } from 'react';

const UserForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [payment, setPayment] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (!email || !payment) {
      setStatus('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('/api/submit-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, payment }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('Submitted!');
      setEmail('');
      setPayment('');
      if (onSubmit) onSubmit();
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label>
        Email:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
      </label>
      <label>
        Payment Info (e.g., Stripe email):
        <input type="text" value={payment} onChange={e => setPayment(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
      </label>
      <button type="submit" style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
      {status && <div style={{ color: status.startsWith('Error') ? '#e63946' : '#457b9d', marginTop: 8 }}>{status}</div>}
    </form>
  );
};

export default UserForm;
