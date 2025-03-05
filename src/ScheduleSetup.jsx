import React from 'react';
import Dropdown from './Dropdown';

const ScheduleSetup = ({ 
  blockSize, 
  startTime, 
  fuzziness, 
  onBlockSizeChange, 
  onStartTimeChange, 
  onFuzzinessChange 
}) => {
  const blockSizeOptions = [
    { value: '30 minutes', label: '30 minutes' },
    { value: '1 hour', label: '1 hour' },
    { value: '2 hours', label: '2 hours' }
  ];

  const startTimeOptions = [
    { value: '12:00 AM', label: '12:00 AM' },
    { value: '1:00 AM', label: '1:00 AM' },
    { value: '2:00 AM', label: '2:00 AM' },
    { value: '3:00 AM', label: '3:00 AM' },
    { value: '4:00 AM', label: '4:00 AM' },
    { value: '5:00 AM', label: '5:00 AM' },
    { value: '6:00 AM', label: '6:00 AM' },
    { value: '7:00 AM', label: '7:00 AM' },
    { value: '8:00 AM', label: '8:00 AM' },
    { value: '9:00 AM', label: '9:00 AM' },
    { value: '10:00 AM', label: '10:00 AM' },
    { value: '11:00 AM', label: '11:00 AM' }
  ];

  return (
    <div className="schedule-setup">
      <h2>Set up your schedule grid</h2>
      <div className="controls">
        <div className="row">
          <div className="label">Block Size</div>
          <div className="input">
            <Dropdown
              value={blockSize}
              onChange={onBlockSizeChange}
              options={blockSizeOptions}
            />
          </div>
          <div className="output">
            <p>Time blocks are {blockSize}</p>
          </div>
        </div>

        <div className="row">
          <div className="label">Start Time</div>
          <div className="input">
            <Dropdown
              value={startTime}
              onChange={onStartTimeChange}
              options={startTimeOptions}
            />
          </div>
          <div className="output">
            <p>Grid starts at {startTime}</p>
          </div>
        </div>

        <div className="row">
          <div className="label">Fuzziness</div>
          <div className="input">
            <input
              type="range"
              min="0"
              max="60"
              value={fuzziness}
              onChange={(e) => onFuzzinessChange(Number(e.target.value))}
              className="fuzziness-slider"
            />
          </div>
          <div className="output">
            <p>{fuzziness} minutes fuzziness</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSetup; 