import { useState } from "react";

export default function Dropdown() {
  const [selected, setSelected] = useState("");
  const options = ["30 minutes", "1 Hour", "2 hours"];

  return (
    <div>
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      <option value="" disabled>Select block size</option>
      {options.map((option)=> (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    {selected && (
        <div>
          <p>You selected: {selected}</p>
          <button
            onClick={() => setSelected("")}
          >
            Cancel
          </button>
        </div>
      )}    </div>
  )
}

/*
this is a less naive version of a select component

instead of returning a select and a bunch of options written out in full,
it generates the options from an array of values defined at the top of the function

now if I want to use a dropdown for several things - block size, start time etc.
do I do these as dedicated components, or do I make a generic dropdown that takes an arrray of options?

And, do I want a cancel button for each drop down (as well as a Clear button for the whole form?)

And how best to make the cancel button appear in line with the dropdown?
- this is particularly needed if it's a multi-select

*/