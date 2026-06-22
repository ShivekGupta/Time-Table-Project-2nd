import React from 'react';

const MastersFeatures = () => {
  const literature = [
    { title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, status: 'Read' },
    { title: 'Deep Residual Learning for Image Recognition', authors: 'He et al.', year: 2016, status: 'To Read' },
    { title: 'Generative Adversarial Nets', authors: 'Goodfellow et al.', year: 2014, status: 'Annotating' }
  ];

  return (
    <div className="masters-features-container" style={{ padding: '20px', color: 'var(--text)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
        <div style={{ fontSize: '3rem' }}>🦉</div>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '5px' }}>Scholars Deep</h2>
          <p style={{ color: 'var(--text-muted)' }}>Research methodologies, literature review, and academic resources.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Literature Review Tracker</h3>
            <button className="share-action-btn" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>+ Add Paper</button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 5px' }}>Title</th>
                <th style={{ padding: '10px 5px' }}>Authors</th>
                <th style={{ padding: '10px 5px' }}>Year</th>
                <th style={{ padding: '10px 5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {literature.map((paper, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 5px', fontWeight: 'bold' }}>{paper.title}</td>
                  <td style={{ padding: '10px 5px' }}>{paper.authors}</td>
                  <td style={{ padding: '10px 5px' }}>{paper.year}</td>
                  <td style={{ padding: '10px 5px' }}>
                    <span style={{ 
                      fontSize: '0.8rem', padding: '3px 8px', borderRadius: '10px',
                      background: paper.status === 'Read' ? 'rgba(16, 185, 129, 0.2)' : paper.status === 'To Read' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: paper.status === 'Read' ? '#10b981' : paper.status === 'To Read' ? '#ef4444' : '#3b82f6'
                    }}>
                      {paper.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Citation Graph Explorer</h3>
            <div style={{ width: '100%', height: '200px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
                {/* Edges */}
                <line x1="200" y1="100" x2="100" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="200" y1="100" x2="300" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="200" y1="100" x2="150" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="200" y1="100" x2="280" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="100" y1="50" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="300" y1="60" x2="350" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {/* Nodes */}
                <circle cx="200" cy="100" r="15" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' }} />
                <text x="200" y="105" fill="#000" fontSize="10" textAnchor="middle" fontWeight="bold">You</text>
                
                <circle cx="100" cy="50" r="12" fill="#3b82f6" />
                <text x="100" y="40" fill="#fff" fontSize="10" textAnchor="middle">Vaswani '17</text>

                <circle cx="300" cy="60" r="10" fill="#10b981" />
                <text x="300" y="45" fill="#fff" fontSize="10" textAnchor="middle">He '16</text>

                <circle cx="150" cy="160" r="10" fill="#8b5cf6" />
                <text x="150" y="175" fill="#fff" fontSize="10" textAnchor="middle">Goodfellow '14</text>

                <circle cx="280" cy="150" r="8" fill="#ec4899" />
                
                <circle cx="50" cy="90" r="6" fill="rgba(255,255,255,0.5)" />
                <circle cx="350" cy="100" r="6" fill="rgba(255,255,255,0.5)" />
              </svg>
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
                Interactive Node Graph
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>Research Progress</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
              <span>Thesis Draft V1</span>
              <span>45%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '15px' }}>
              <div style={{ width: '45%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Next milestone: Complete Chapter 2 (Literature Review) by Aug 15th.</p>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>Thesis Version Control</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace' }}>
              <div style={{ color: '#10b981', marginBottom: '5px' }}>✓ Main Branch (Up to date)</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', marginBottom: '5px' }}>
                <span style={{ color: '#fbbf24' }}>commit a1b2c3d</span>
                <span style={{ color: 'var(--text-muted)' }}>2 hrs ago</span>
              </div>
              <div style={{ marginBottom: '10px' }}>"Added citations for Section 2.3"</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="share-action-btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>View Diff</button>
                <button className="share-action-btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--accent)' }}>Revert</button>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>Citation Manager Sync</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Link your Zotero or Mendeley account to auto-sync papers and bibliographies.</p>
            <button className="share-action-btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Connect Zotero</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MastersFeatures;
