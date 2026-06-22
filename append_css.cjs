const fs = require('fs');
const css = `
/* MAP NAVIGATION OVERLAY STYLES */
.map-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-modal-content {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  height: 85%;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.map-modal-close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(255, 0, 0, 0.2);
  color: #ffcccc;
  border: 1px solid rgba(255, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 100;
  font-weight: bold;
  transition: all 0.2s;
}

.map-modal-close-btn:hover {
  background: rgba(255, 0, 0, 0.5);
  color: #fff;
}

.pirate-map-container {
  user-select: none;
}
`;
fs.appendFileSync('src/styles.css', css);
