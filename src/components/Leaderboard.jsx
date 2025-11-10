import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  // Use deployed backoffice API
  fetch('https://backoffice.rizzosai.com/api/leaderboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        return res.json();
      })
      .then((data) => {
        setLeaders(data.leaders || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#e63946', color: '#fff' }}>
            <th style={{ padding: 10, borderRadius: '8px 0 0 8px' }}>Rank</th>
            <th style={{ padding: 10 }}>Username</th>
            <th style={{ padding: 10, borderRadius: '0 8px 8px 0' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders.length === 0 && (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>No leaders yet.</td></tr>
          )}
          {leaders.map((user, idx) => (
            <tr key={user.username} style={{ background: idx % 2 === 0 ? '#f1faee' : '#fff' }}>
              <td style={{ padding: 10, fontWeight: 'bold', color: '#457b9d' }}>{idx + 1}</td>
              <td style={{ padding: 10 }}>{user.username}</td>
              <td style={{ padding: 10 }}>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
