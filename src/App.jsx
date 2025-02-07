import { useState } from 'react'
import './App.css'

import Dropdown from "./Dropdown"; 


function App() {

  const [selectedBlockSize, setSelectedBlockSize] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");

  const [fuzziness, setFuzziness] = useState("");
  const [error, setError] = useState("");
  const [submittedValue, setSubmittedValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    
    // Allow only numbers (empty string is also allowed for backspace)
    if (value === "" || /^\d+$/.test(value)) {
      setFuzziness(value);
      setError(""); // clear error
    }   
  };
    
  const handleSubmit = () => {
    if (fuzziness === "") {
      setError("Please enter a number");
    } else {
      setSubmittedValue(fuzziness);
      setError("");
    }
  };


  return (
    <div style={{width: "600px"}}>
      <h1>Fuzzy</h1>
      <h2>Set up your schedule</h2>
      
      <div style={{ display: "flex", alignItems: "center"}}>
        <div style={{ flex: 2}}>
          <p>Block size:</p>
        </div>
        <div style={{ flex: 1}}>
          <Dropdown options={["30 minutes", "1 hour", "2 hours"]} onSelect={setSelectedBlockSize} />
        </div>
        <div style={{ flex: 4}}>
          {selectedBlockSize && <p>You selected: {selectedBlockSize}</p>}
        </div>
      </div>      
      
      <div style={{ display: "flex", alignItems: "center", }}>
        <div style={{ flex: 2}}>
          <p>Start time:</p>
        </div>
        <div style={{ flex: 1}}>
          <Dropdown options={["8:00 AM", "9:00 AM", "10:00 AM"]} onSelect={setSelectedStartTime} />
        </div>
        <div style={{ flex: 4}}>
          {selectedStartTime && <p>You selected: {selectedStartTime}</p>}
        </div>
      </div>  

      <div style={{ display: "flex", alignItems: "center", }}>
        <div style={{ flex: 2}}>
          <p>Fuzziness:</p>
        </div>
        <div style={{ flex: 1}}>
          <input 
            type="text" 
            value={fuzziness} 
            onChange={handleChange} 
            placeholder="Enter a number..."
          />
          <button onClick={handleSubmit}>OK</button>
            {/* Error message */}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div style={{ flex: 4}}>
          {fuzziness && <p>You entered: {fuzziness}</p>}
        </div>
      </div>  

    </div>
  )
}

export default App
