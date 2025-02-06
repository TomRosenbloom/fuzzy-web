import { useState } from "react";

export default function Dropdown() {
  const [selected, setSelected] = useState("");

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  return (
    <div>
      <label htmlFor="dropdown">
        Choose an option:
      </label>
      <select
        value={selected} // this is needed to enable the 'Select...' option on the initial render
        onChange={handleChange}
      >
        <option value="" disabled>
          Select...
        </option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      {selected && ( // the && operator returns the right side if the left side is 'truthy' i.e. any of "", 0, false, null, undefined
      <div>
        <p>You selected: {selected}</p>
        <button
            onClick={() => setSelected("")}
        >
            Cancel
        </button>
      </div>
      )}
    </div>
  );
}

/*
This is a function that returns a bunch of html to make a drop down
It's a 'naive' solution - a select and some options
As well as the drop down, it shows what has been selected, and provides a cancel button

following the very common react pattern, we use the const keyword to declare a name 
for the variable that will hold the selected option, and a name for the function to set that variable
in this case, selected and setSelected
we also pass empty string as the default value

then we define a function for onchage action on the select element
- event is the js event object passed automatically when the dropdown value changes
- it contains information about the event, including the element that triggered it (event.target)
- so event.target is our select element
- event.target.value is the selected option

*/