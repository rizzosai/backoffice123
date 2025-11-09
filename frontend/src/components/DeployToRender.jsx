import { useState } from 'react';

export default function DeployToRender() {
  const [status, setStatus] = useState('');

  async function handleDeploy() {
    setStatus('Deploying...');
    try {
      // This should call a backend endpoint that triggers a Render deploy webhook
      const res = await fetch('/api/deploy-to-render', { method: 'POST' });
      if (res.ok) {
        setStatus('Deployment triggered! Check Render for progress.');
      } else {
        setStatus('Failed to trigger deployment.');
      }
    } catch {
      setStatus('Failed to trigger deployment.');
    }
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '2rem', margin: '2rem 0' }}>
      <h2 style={{ color: '#457b9d' }}>Deploy to Render</h2>
      <p style={{ color: '#888' }}>Click the button below to trigger a deployment of your site on Render.com.</p>
      <button onClick={handleDeploy} style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 32px', fontSize: '1.1rem', cursor: 'pointer' }}>Deploy Now</button>
      {status && <div style={{ marginTop: 16, color: status.includes('fail') ? '#e63946' : '#2a9d8f' }}>{status}</div>}
    </div>
  );
}
