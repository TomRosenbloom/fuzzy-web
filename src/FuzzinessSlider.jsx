import React, { useState } from 'react';
import './FuzzinessSlider.css';

export default function FuzzinessSlider({ value = 0, onChange = () => {}, blockSize = '1 hour' }) {
  const [showWarning, setShowWarning] = useState(false);
  
  // Convert blockSize string to minutes
  const blockSizeInMinutes = {
    '30 minutes': 30,
    '1 hour': 60,
    '2 hours': 120
  }[blockSize] || 60;

  // Calculate max fuzziness (25% of block size)
  const maxFuzziness = blockSizeInMinutes * 0.25;

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    if (newValue > maxFuzziness) {
      setShowWarning(true);
      onChange(maxFuzziness); // Set to max allowed value
    } else {
      setShowWarning(false);
      onChange(newValue);
    }
  };

  return (
    <div className="fuzziness-slider-container">
      <input
        type="range"
        min="0"
        max={Math.max(60, maxFuzziness)}
        value={value}
        onChange={handleChange}
        className="fuzziness-slider"
      />
      
      {showWarning && (
        <div className="modal-overlay" onClick={() => setShowWarning(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Maximum Fuzziness Reached</h3>
            <p>
              For {blockSize} time slots, the maximum fuzziness is limited to{' '}
              {Math.floor(maxFuzziness)} minutes (25% of slot size).
            </p>
            <button 
              className="modal-close-btn"
              onClick={() => setShowWarning(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
