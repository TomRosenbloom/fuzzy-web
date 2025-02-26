import { useState } from 'react'
import './App.css'

import Dropdown from "./Dropdown"; 
import FuzzinessSlider from './FuzzinessSlider';
import ActivityTypeManager from './ActivityTypeManager';
import TimeGrid from './TimeGrid';


function App() {

  const [selectedBlockSize, setSelectedBlockSize] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");

  const [fuzziness, setFuzziness] = useState(0);
  const handleFuzzinessChange = (value) => {
    setFuzziness(value);  // FuzzinessSlider now passes the value directly
  };

  const [overlap, setOverlap] = useState(0);
  const handleOverlapChange = (event) => {
    setOverlap(Number(event.target.value));
  };

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleActivitiesChange = (newActivities) => {
    setActivities(newActivities);
  };

  return (
    <div className="container">
      <h1>Fuzzy</h1>
      <h2>Set up your schedule grid</h2>
      
      <div className="row">
        <div className="label">
          <p>Block size:</p>
        </div>
        <div className="input">
          <Dropdown options={["30 minutes", "1 hour", "2 hours"]} onSelect={setSelectedBlockSize} />
        </div>
        <div className="output">
          {selectedBlockSize && <p>You selected: {selectedBlockSize}</p>}
        </div>
      </div>      
      
      <div className="row">
        <div className="label">
          <p>Start time:</p>
        </div>
        <div className="input">
          <Dropdown options={["8:00 AM", "9:00 AM", "10:00 AM"]} onSelect={setSelectedStartTime} />
        </div>
        <div className="output">
          {selectedStartTime && <p>You selected: {selectedStartTime}</p>}
        </div>
      </div>  

      <div className="row">
        <div className="label">
          <p>Fuzziness:</p>
        </div>
        <div className="input">
          <FuzzinessSlider 
            value={fuzziness} 
            onChange={handleFuzzinessChange}
            blockSize={selectedBlockSize}
          />
        </div>
        <div className="output">
          <p>{fuzziness} minutes</p>
        </div>
      </div>  

      <div className="row">
        <div className="whole-row">
          <ActivityTypeManager onActivitiesChange={handleActivitiesChange} />
        </div>
      </div>

      <div className="row">
        <div className="whole-row">
          <TimeGrid 
            blockSize={selectedBlockSize} 
            startTime={selectedStartTime}
            activities={activities}
            selectedActivity={selectedActivity}
            onActivitySelect={setSelectedActivity}
            fuzziness={fuzziness}
          />
        </div>
      </div>

    </div>
  )
}

export default App;
