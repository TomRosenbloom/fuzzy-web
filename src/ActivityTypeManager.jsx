import { useState, useEffect, useRef } from "react";
import "./ActivityTypeManager.css"; // Import external CSS file

export default function ItemManager() {
  const [tempItem, setTempItem] = useState({ name: "", color: "" });
  const [items, setItems] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [customActivity, setCustomActivity] = useState('');

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
    const updatedItem = { ...tempItem, [name]: value }; 
    setTempItem(updatedItem);
  
    if (updatedItem.name && updatedItem.color) {
      saveItem(updatedItem);
    }

    if (name === 'name') {  // Only open dropdown when activity name is selected
      setDropdownOpen(true);
    } else {
      setTimeout(() => setDropdownOpen(false), 0);  // Keep existing close behavior for color selection
    }
  };

  const saveItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
    setTempItem({ name: "", color: "" }); // Reset selection
  };

  const handleDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleActivitySelect = (activity) => {
    setTempItem({
      name: activity,
      color: ''
    });
    setDropdownOpen(true);  // Automatically open the dropdown
  };

  const handleActivityInput = (e) => {
    const value = e.target.value;
    setCustomActivity(value);
    handleChange("name", value);
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
    <div className="im-container">
      <h2>Create your activities</h2>
      <div className="form-group">
        {/* Replace select with input and datalist */}
        <div className="activity-type-manager-input-container">
          <input
            list="activity-type-manager-activities"
            name="activity-type-manager-name"
            value={tempItem.name}
            onChange={handleActivityInput}
            onBlur={() => {
              if (!tempItem.color && !tempItem.name) {  // Only clear if no color AND no name
                setTempItem(prev => ({ ...prev, name: '' }));
                setCustomActivity('');
              }
            }}
            placeholder="Enter or select activity"
            className="activity-type-manager-input"
            autoComplete="off"
          />
          <datalist id="activity-type-manager-activities">
            {allNames
              .filter(name => !usedNames.includes(name))
              .map((name) => (
                <option key={name} value={name} />
              ))}
          </datalist>
        </div>
        {/* Color Dropdown */}
        <div className="dropdown" ref={dropdownRef}>
          <button 
            className="dropdown-btn" 
            onClick={() => setDropdownOpen((prev) => !prev)} 
            style={{ backgroundColor: tempItem.color || "#ccc" }}
            disabled={!tempItem.name}
          >
            {tempItem.color ? "" : tempItem.name ? `Select colour for ${tempItem.name}` : "Select colour"}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {allColors
                .filter(color => !usedColors.includes(color.value))
                .map((color) => (
                  <div
                    key={color.value}
                    className="dropdown-item"
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleChange("color", color.value)}
                  >
                    <span className="color-hover-text">
                      {tempItem.name}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>

      {/* Saved Items List */}
      <div className="saved-items">
        {items.length === 0 ? (
          <p className="no-items-message">No activities created yet</p>
        ) : (
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
