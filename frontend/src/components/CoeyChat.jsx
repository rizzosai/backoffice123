import { useState } from 'react';

export default function CoeyChat() {
  const [messages, setMessages] = useState([
    { sender: 'coey', text: 'Hi! I’m Coey. Ask me anything about getting paid, setting up ads, or using your dashboard.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/coey-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'coey', text: data.reply || 'Sorry, I could not answer that.' }]);
    } catch {
      setMessages(msgs => [...msgs, { sender: 'coey', text: 'Sorry, there was a problem connecting to Coey.' }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, width: 340, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', zIndex: 2000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#e63946', color: '#fff', padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: 1, textAlign: 'center' }}>Coey – Your AI Assistant</div>
      <div style={{ flex: 1, padding: '1rem', maxHeight: 320, overflowY: 'auto', fontSize: '1rem', background: '#f7f7f7' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12, textAlign: msg.sender === 'coey' ? 'left' : 'right' }}>
            <span style={{
              display: 'inline-block',
              background: msg.sender === 'coey' ? '#457b9d' : '#e63946',
              color: '#fff',
              borderRadius: 12,
              padding: '0.5rem 1rem',
              maxWidth: 260,
              wordBreak: 'break-word',
            }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div style={{ color: '#457b9d', fontStyle: 'italic' }}>Coey is typing…</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #eee', background: '#fff' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Coey anything…"
          style={{ flex: 1, border: 'none', padding: '0.75rem', fontSize: '1rem', outline: 'none', borderRadius: 0 }}
          disabled={loading}
        />
        <button type="submit" style={{ background: '#457b9d', color: '#fff', border: 'none', padding: '0 1.2rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }} disabled={loading}>Send</button>
      </form>
    </div>
  );
}
