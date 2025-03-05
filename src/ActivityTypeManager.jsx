import { useState, useEffect, useRef } from "react";
import "./ActivityTypeManager.css"; // Import external CSS file

export default function ItemManager({ onActivitiesChange }) {
  const [tempItem, setTempItem] = useState({ name: "", color: "" });
  const [items, setItems] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [customActivity, setCustomActivity] = useState('');
  const [itemContextMenu, setItemContextMenu] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(null);

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
  };

  const saveItem = (item) => {
    const newItems = [...items, item];
    setItems(newItems);
    setTempItem({ name: "", color: "" });
    onActivitiesChange(newItems);  // Notify parent of change
  };

  const handleItemMenuClick = (e, item, index) => {
    e.preventDefault();
    e.stopPropagation();
    setItemContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      index
    });
  };

  const handleColorChange = (index, newColor) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], color: newColor };
    setItems(updatedItems);
    onActivitiesChange(updatedItems);
    setItemContextMenu(null);
  };

  const handleDelete = (index) => {
    setShowDeleteWarning({
      index,
      item: items[index]
    });
    setItemContextMenu(null);  // Close context menu when showing warning
  };

  const handleCancelDelete = () => {
    setShowDeleteWarning(null);
    setItemContextMenu(null);  // Ensure context menu is also closed
  };

  const confirmDelete = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onActivitiesChange(newItems);
    setShowDeleteWarning(null);
    setItemContextMenu(null);
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
    <div className="activity-manager" onClick={() => {
      setItemContextMenu(null);
      setShowDeleteWarning(null);
    }}>
      <h2>Activity Types</h2>
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
                    onClick={(e) => {
                      e.stopPropagation();  // Stop event bubbling
                      handleChange("color", color.value);
                      setDropdownOpen(false);  // Close dropdown
                    }}
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
                <span 
                  className="saved-item" 
                  style={{ backgroundColor: item.color }}
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(item));
                  }}
                >
                  {item.name}
                  <span 
                    className="item-menu-icon"
                    onClick={(e) => handleItemMenuClick(e, item, index)}
                  >
                    ⋮
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Item Context Menu */}
      {itemContextMenu && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            top: itemContextMenu.y,
            left: itemContextMenu.x,
          }}
          onClick={e => e.stopPropagation()}
          onMouseLeave={() => setItemContextMenu(null)}
        >
          <div className="context-menu-item color-picker">
            Change Color
            <div className="color-options">
              {allColors
                .filter(color => !usedColors.includes(color.value) || color.value === itemContextMenu.item.color)
                .map((color) => (
                  <div
                    key={color.value}
                    className="color-option"
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(itemContextMenu.index, color.value)}
                  />
                ))}
            </div>
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleDelete(itemContextMenu.index)}
          >
            Delete Activity
          </div>
        </div>
      )}

      {/* Delete Warning Modal */}
      {showDeleteWarning && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Activity</h3>
            <p>
              Deleting "{showDeleteWarning.item.name}" will also remove all instances 
              of this activity from your schedule grid.
            </p>
            <div className="modal-buttons">
              <button 
                className="cancel-btn"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={() => confirmDelete(showDeleteWarning.index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
