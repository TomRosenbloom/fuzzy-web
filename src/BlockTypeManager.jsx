import { useState } from "react";

export default function ItemManager() {
  const [tempItem, setTempItem] = useState({
    name: "",
    color: "red"
  });

  const [items, setItems] = useState([]); // Stores multiple saved items

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTempItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleSave = () => {
    if (!tempItem.name.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    setItems((prevItems) => [...prevItems, tempItem]); // Add new item to array
    setTempItem({ name: "", color: "red" }); // Reset input fields
  };

  return (
    <div>
      <h2>Add an Item</h2>

      {/* Name Input */}
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={tempItem.name}
          onChange={handleChange}
        />
      </label>

      {/* Color Dropdown */}
      <label>
        Color:
        <select name="color" value={tempItem.color} onChange={handleChange}>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </select>
      </label>

      {/* Save Button */}
      <button onClick={handleSave}>Save Item</button>

      <h2>Saved Items</h2>
      {items.length === 0 ? (
        <p>No items saved yet.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <strong>Name:</strong> {item.name} | <strong>Color:</strong> {item.color} | <strong>Icon:</strong> {item.icon}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
