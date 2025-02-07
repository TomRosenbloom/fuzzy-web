import { useState } from 'react'
import './App.css'

import Dropdown from "./Dropdown"; 
import FuzzinessSlider from './FuzzinessSlider';
import OverlapSlider from './OverlapSlider';


function App() {

  const [selectedBlockSize, setSelectedBlockSize] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");

  const [fuzziness, setFuzziness] = useState(30);
  const handleFuzzinessChange = (event) => {
    setFuzziness(Number(event.target.value)); // Convert string to number
  };

  const [overlap, setOverlap] = useState(0);
  const handleOverlapChange = (event) => {
    setOverlap(Number(event.target.value));
  };


  return (
    <div className="container">
      <h1>Fuzzy</h1>
      <h2>Set up your schedule</h2>
      
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
          <FuzzinessSlider value={fuzziness} onChange={handleFuzzinessChange} />
        </div>
        <div className="output">
          {fuzziness && <p>You entered: {fuzziness}</p>}
        </div>
      </div>  

      <div className="row">
        <div className="label">
          <p>Overlap:</p>
        </div>
        <div className="input">
          <OverlapSlider value={overlap} onChange={handleOverlapChange} />
        </div>
        <div className="output">
          {overlap && <p>You entered: {overlap}</p>}
        </div>
      </div>  

    </div>
  )
}

export default App
