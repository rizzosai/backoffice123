import React, { useEffect, useState } from 'react';

const LiveFeed = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Polling every 5 seconds for new events (replace with WebSocket for production)
    const fetchFeed = () => {
      fetch('/api/livefeed')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch live feed');
          return res.json();
        })
        .then((data) => {
          setEvents(data.events || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
    fetchFeed();
    const interval = setInterval(fetchFeed, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading live feed...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{ marginTop: 20 }}>
      {events.length === 0 && <div>No recent signups or payments yet.</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event, idx) => (
          <li key={idx} style={{ background: '#f1faee', margin: '10px 0', padding: '12px 18px', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
            <span style={{ color: event.type === 'payment' ? '#e63946' : '#457b9d', fontWeight: 'bold' }}>
              {event.type === 'payment' ? '💸 Payment' : '📝 Signup'}
            </span>
            <span style={{ marginLeft: 12 }}>
              {event.message}
            </span>
            <span style={{ float: 'right', color: '#888', fontSize: 12 }}>{event.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveFeed;
