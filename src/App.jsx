import { useState } from 'react'
import './App.css'

import Dropdown from "./Dropdown"; 


function App() {

  const [selectedBlockSize, setSelectedBlockSize] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");


  return (
    <>
      <h1>Fuzzy</h1>
      <h2>Set up your schedule</h2>
      
      <div style={{ display: "flex", alignItems: "center", width: "600px"}}>
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

    </>
  )
}

export default App
