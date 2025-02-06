import { useState } from "react";

export default function BlockSizeDropdown() {
  const [selected, setSelected] = useState("");
  const options = ["30 minutes", "1 Hour", "2 hours"];

  return (
    <div>
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      <option value="">Select block size</option>
      {options.map((option)=> (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>  
    </div>
  )
}

/*

so am I right in thinking that the var in state that has been set here is 'selected', 
so I need to change that to 'blockSize' in order to add a dropdown for another value?

...but I still want to know if I can make a generic version - whihc would mean defining
consts like blockSize, startTime etc in app.jsx, right?

*/