import { useState } from "react";

export default function Dropdown({options, onSelect}) {
  const [selected, setSelected] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    onSelect(value); // Pass selected value to parent
  };

  return (
    <div>
    <select value={selected} onChange={handleChange}>
      <option value="" disabled>Select an option</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>

    </div>
  )
}

/*
this is a reusable generic dropdown

*/