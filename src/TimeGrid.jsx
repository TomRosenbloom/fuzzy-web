import React, { useState } from 'react';
import './TimeGrid.css';

export default function TimeGrid({ 
  blockSize, 
  startTime, 
  activities, 
  selectedActivity, 
  onActivitySelect 
}) {
  const [assignments, setAssignments] = useState({});  // Store cell assignments

  // Convert blockSize to minutes for easier calculations
  const blockSizeInMinutes = {
    '30 minutes': 30,
    '1 hour': 60,
    '2 hours': 120
  }[blockSize] || 60;  // default to 1 hour

  // Convert startTime string to minutes from midnight
  const getStartMinutes = (timeStr) => {
    if (!timeStr) return 8 * 60; // default to 8:00 AM
    const [hours, period] = timeStr.split(':');
    let hour = parseInt(hours);
    if (period.includes('PM') && hour !== 12) hour += 12;
    if (period.includes('AM') && hour === 12) hour = 0;
    return hour * 60;
  };

  // Generate time slots from startTime to startTime + 24 hours
  const generateTimeSlots = () => {
    const slots = [];
    const startMinutes = getStartMinutes(startTime);
    const totalMinutesInDay = 24 * 60;
    
    for (let minutes = startMinutes; minutes < startMinutes + totalMinutesInDay; minutes += blockSizeInMinutes) {
      const adjustedMinutes = minutes % totalMinutesInDay;
      const hours = Math.floor(adjustedMinutes / 60);
      const mins = adjustedMinutes % 60;
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      slots.push(
        `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
      );
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault();
    const cellKey = `${day}-${timeSlot}`;
    
    try {
      const item = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Only assign if the cell is empty
      if (!assignments[cellKey]) {
        setAssignments(prev => ({
          ...prev,
          [cellKey]: item
        }));
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  return (
    <div className="time-grid-container">
      {/* Time column */}
      <div className="time-column">
        <div className="header-cell"></div>
        {timeSlots.map((time, index) => (
          <div key={index} className="time-cell">
            {time}
          </div>
        ))}
      </div>

      {/* Day columns */}
      {daysOfWeek.map((day, dayIndex) => (
        <div key={dayIndex} className="day-column">
          <div className="header-cell">{day}</div>
          {timeSlots.map((timeSlot, slotIndex) => {
            const cellKey = `${day}-${timeSlot}`;
            const assignment = assignments[cellKey];
            return (
              <div 
                key={slotIndex} 
                className={`grid-cell ${assignment ? 'assigned' : ''}`}
                style={{
                  backgroundColor: assignment ? assignment.color : undefined
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day, timeSlot)}
                data-time={timeSlot}
                data-day={day}
              >
                {assignment && (
                  <span className="cell-activity-name">{assignment.name}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
} 