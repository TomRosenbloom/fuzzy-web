import { useState, useEffect, useRef } from "react";
import "./ActivityTypeManager.css"; // Import external CSS file

export default function ItemManager() {
  const [tempItem, setTempItem] = useState({ name: "", color: "" });
  const [items, setItems] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const allNames = ["Work", "Play", "Eat", "Sleep"];
  const allColors = [
    { name: "#3D5A5E", value: "#3D5A5E" },
    { name: "#DB7A2A", value: "#DB7A2A" },
    { name: "#2CC2DB", value: "#2CC2DB" },
    { name: "#A0DB2C", value: "#A0DB2C" },
    { name: "#AF2CDB", value: "#AF2CDB" },
    { name: "#89778F", value: "#89778F" },
  ];

  const usedNames = items.map((item) => item.name);
  const usedColors = items.map((item) => item.color);

  const handleChange = (name, value) => {
    setTempItem((prevItem) => ({ ...prevItem, [name]: value }));
    setTimeout(() => setDropdownOpen(false), 0);
  };

  const handleSave = () => {
    if (!tempItem.color) {
      alert("Please select a color before saving!");
      return;
    }
    setItems((prevItems) => [...prevItems, tempItem]);
    setTempItem({ name: "", color: "" });
  };

  const handleDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

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
    <div className="container">
      <h2>Create your activities</h2>
      <div className="form-group">
        {/* Name Dropdown */}
        <select name="name" value={tempItem.name} onChange={(e) => handleChange("name", e.target.value)}>
          <option value="" disabled hidden>
            Select name
          </option>
          {allNames.map((name) => (
            <option key={name} value={name} disabled={usedNames.includes(name)}>
              {name} {usedNames.includes(name) ? "(Used)" : ""}
            </option>
          ))}
        </select>

        {/* Color Dropdown */}
        <div className="dropdown" ref={dropdownRef}>
          <button className="dropdown-btn" onClick={() => setDropdownOpen((prev) => !prev)} style={{ backgroundColor: tempItem.color || "#ccc" }}>
            {tempItem.color ? "" : "Select Colour"}
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {allColors.map((color) => (
                <div
                  key={color.value}
                  className={`dropdown-item ${usedColors.includes(color.value) ? "disabled" : ""}`}
                  onClick={() => !usedColors.includes(color.value) && handleChange("color", color.value)}
                  style={{ backgroundColor: color.value }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave} disabled={!tempItem.name || !tempItem.color}>
          Save
        </button>
      </div>

      {/* Saved Items List */}
      <div className="saved-items">
        {items.length === 0 ? <p>No items saved yet.</p> : (
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <span className="saved-item" style={{ backgroundColor: item.color }}>{item.name}</span>
                <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
