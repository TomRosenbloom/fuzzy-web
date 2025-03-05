import React, { useState } from 'react'
import './App.css'

import ActivityTypeManager from './ActivityTypeManager';
import TimeGrid from './TimeGrid';
import ScheduleSetup from './ScheduleSetup';


function App() {
  const [blockSize, setBlockSize] = useState('1 hour');
  const [startTime, setStartTime] = useState('8:00 AM');
  const [activities, setActivities] = useState([]);
  const [fuzziness, setFuzziness] = useState(0);

  const handleBlockSizeChange = (e) => {
    setBlockSize(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleFuzzinessChange = (value) => {
    setFuzziness(value);
  };

  const handleActivitiesChange = (newActivities) => {
    setActivities(newActivities);
  };

  return (
    <div className="app-container">
      <h1>Fuzzy</h1>
      <div className="content">
        <div className="left-panel">
          <ScheduleSetup 
            blockSize={blockSize}
            startTime={startTime}
            fuzziness={fuzziness}
            onBlockSizeChange={handleBlockSizeChange}
            onStartTimeChange={handleStartTimeChange}
            onFuzzinessChange={handleFuzzinessChange}
          />
          <ActivityTypeManager onActivitiesChange={handleActivitiesChange} />
        </div>
        <TimeGrid 
          blockSize={blockSize}
          startTime={startTime}
          activities={activities}
          fuzziness={fuzziness}
        />
      </div>
    </div>
  )
}

export default App;
