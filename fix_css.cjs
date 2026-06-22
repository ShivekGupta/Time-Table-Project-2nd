const fs = require('fs');
const lines = fs.readFileSync('src/components/FocusMode.css', 'utf-8').split('\n');
const newLines = lines.slice(0, 247);
const correctCSS = `
/* Co-op UI Styles */
.coop-toggle-wrapper {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  position: relative;
  z-index: 1;
}

.coop-toggle-container {
  background: rgba(0,0,0,0.4);
  border-radius: 20px;
  padding: 4px;
  display: flex;
  gap: 4px;
  border: 1px solid rgba(255,255,255,0.1);
}

.coop-toggle-btn {
  border: none;
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  font-weight: bold;
  background: transparent;
  color: #a0aec0;
}

.coop-toggle-btn.active-solo {
  background: #b8860b;
  color: #000;
}

.coop-toggle-btn.active-coop {
  background: #10b981;
  color: #fff;
}

.coop-fleet-container {
  margin-top: 25px;
  background: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  position: relative;
  z-index: 1;
}

.coop-fleet-title {
  font-size: 0.9rem;
  color: #10b981;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
}

.coop-fleet-users {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.coop-user-card {
  text-align: center;
}

.coop-user-avatar {
  font-size: 1.5rem;
}

.coop-user-avatar.synced {
  filter: drop-shadow(0 0 8px rgba(16,185,129,0.8));
}

.coop-user-name {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 4px;
}

.coop-user-status {
  font-size: 0.8rem;
  margin-top: 4px;
}

.coop-user-status.focusing {
  color: #10b981;
}

.coop-user-status.break {
  color: #3b82f6;
}

.coop-user-status.paused {
  color: #f59e0b;
}

.coop-user-status.idle {
  color: #a0aec0;
}
`;
fs.writeFileSync('src/components/FocusMode.css', newLines.join('\n') + correctCSS);
