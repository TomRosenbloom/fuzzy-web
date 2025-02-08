import { useState, useEffect, useRef } from "react";

export default function ItemManager() {
  const [tempItem, setTempItem] = useState({
    name: "Work", // default value
    color: ""
  });

  const [items, setItems] = useState([]); // Stores multiple saved items

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const names = ["Work", "Play", "Eat", "Sleep"];
  const colors = [
    { name: "#3D5A5E", value: "#3D5A5E" },
    { name: "#DB7A2A", value: "#DB7A2A" },
    { name: "#2CC2DB", value: "#2CC2DB" },
    { name: "#A0DB2C", value: "#A0DB2C" },
    { name: "#AF2CD", value: "#AF2CDB" },
    { name: "#89778F", value: "#89778F" }
  ];

  const handleChange = (name, value) => {
    setTempItem((prevItem) => ({ ...prevItem, [name]: value }));
    // Close dropdown after selection using a short delay
    setTimeout(() => setDropdownOpen(false), 0);
  };

  const handleSave = () => {
    if (!tempItem.color) {
      alert("Please select a color before saving!");
      return;
    }
    setItems((prevItems) => [...prevItems, tempItem]); // Add new item to array
    setTempItem({ name: "Work", color: "" }); // Reset input fields
  };

  const handleDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index)); // Remove item by index
  };  

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  return (
    <div>
      <h2>Add activity types</h2>

      {/* Name Dropdown */}
      <label>
        Name:
        <select name="name" value={tempItem.name} onChange={handleChange}>
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      {/* Color Dropdown with Swatches */}
      {/* <label>
        Color:
        <select name="color" value={tempItem.color} onChange={handleChange}>
          <option value="" disabled hidden>
            Select Color
          </option>
          {colors.map((color) => (
            <option
              key={color.value}
              value={color.value}
              style={{
                backgroundColor: color.value,
                //color: color.value === "yellow" ? "black" : "white", // this was for avoiding contrast problems with text
              }}
            >
              {color.name} { }
            </option>
          ))}
        </select>
      </label> */}

      {/* Custom Color Dropdown */}
      <label>
        Color:
        <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{
              backgroundColor: tempItem.color || "#ccc",
              color: tempItem.color === "yellow" ? "black" : "white",
              border: "1px solid #000",
              padding: "5px 10px",
              cursor: "pointer",
              width: "120px",
              textAlign: "left",
            }}
          >
            {tempItem.color ? "● Selected" : "Select Color"}
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                width: "120px",
                zIndex: 10,
              }}
            >
              {colors.map((color) => (
                <div
                  key={color.value}
                  onClick={() => handleChange("color", color.value)}
                  style={{
                    backgroundColor: color.value,
                    color: color.value === "yellow" ? "black" : "white",
                    padding: "5px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {color.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </label>

      {/* Save Button */}
      <button onClick={handleSave}>Save Item</button>

      <h3>Saved activity types</h3>
      {items.length === 0 ? (
        <p>No items saved yet.</p>
      ) : (
        <ul className="activities">
          {items.map((item, index) => (
            <li key={index}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "120px",
                  height: "30px",
                  backgroundColor: item.color,
                  marginRight: "5px",
                  borderRadius: "8px",
                  color: "white",
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: "1em",
                  padding: "0.6em 1.2em"
                }}
              >{item.name}</span>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
