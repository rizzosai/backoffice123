import { useState } from 'react';

export default function CoeyCustomAnswers() {
  const [qaList, setQaList] = useState([
    { question: '', answer: '' }
  ]);
  const [status, setStatus] = useState('');

  function handleChange(i, field, value) {
    setQaList(list => {
      const copy = [...list];
      copy[i][field] = value;
      return copy;
    });
  }

  function addRow() {
    setQaList(list => [...list, { question: '', answer: '' }]);
  }

  function removeRow(i) {
    setQaList(list => list.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    const filtered = qaList.filter(q => q.question && q.answer);
    setStatus('Saving...');
    try {
      const res = await fetch('/api/coey-custom-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered)
      });
      if (res.ok) {
        setStatus('Custom answers saved!');
      } else {
        setStatus('Failed to save.');
      }
    } catch {
      setStatus('Failed to save.');
    }
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '2rem', margin: '2rem 0' }}>
      <h2 style={{ color: '#457b9d' }}>Custom Coey Answers</h2>
      <p style={{ color: '#888' }}>Add questions and answers you want Coey to answer exactly as you specify. These will override the AI for matching questions.</p>
      {qaList.map((qa, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="If user asks..."
            value={qa.question}
            onChange={e => handleChange(i, 'question', e.target.value)}
            style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Coey should say..."
            value={qa.answer}
            onChange={e => handleChange(i, 'answer', e.target.value)}
            style={{ flex: 3, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button onClick={() => removeRow(i)} style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 6, padding: '0 12px', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
      <button onClick={addRow} style={{ background: '#457b9d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', marginRight: 12, cursor: 'pointer' }}>Add</button>
      <button onClick={handleSave} style={{ background: '#2a9d8f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>Save</button>
      {status && <div style={{ marginTop: 16, color: status.includes('fail') ? '#e63946' : '#2a9d8f' }}>{status}</div>}
    </div>
  );
}
