import React, { useState, useEffect } from 'react';
import './TimeGrid.css';

export default function TimeGrid({ 
  blockSize, 
  startTime, 
  activities, 
  selectedActivity, 
  onActivitySelect 
}) {
  const [assignments, setAssignments] = useState({});  // Store cell assignments
  const [contextMenu, setContextMenu] = useState(null);

  // Add useEffect to watch for activity changes
  useEffect(() => {
    // Update all assignments when activities change
    setAssignments(prev => {
      const newAssignments = { ...prev };
      Object.keys(newAssignments).forEach(key => {
        const assignment = newAssignments[key];
        // Find the updated activity
        const updatedActivity = activities.find(a => a.name === assignment.name);
        if (updatedActivity) {
          // Update the assignment with the new color
          newAssignments[key] = {
            ...assignment,
            color: updatedActivity.color
          };
        } else {
          // If activity no longer exists, remove the assignment
          delete newAssignments[key];
        }
      });
      return newAssignments;
    });
  }, [activities]);

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

  const handleDragStart = (e, day, timeSlot, isDuplicating) => {
    const cellKey = `${day}-${timeSlot}`;
    if (assignments[cellKey]) {
      // Store whether Shift is pressed and the assignment data
      const dragData = {
        type: 'grid-cell',
        cellKey: cellKey,
        assignment: assignments[cellKey],
        isDuplicating: isDuplicating
      };
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    }
  };

  const handleDragEnd = (e) => {
    // If dropped outside a valid target, dropEffect will be "none"
    if (e.dataTransfer.dropEffect === "none") {
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.type === 'grid-cell' && !data.isDuplicating) {
          setAssignments(prev => {
            const newAssignments = { ...prev };
            delete newAssignments[data.cellKey];
            return newAssignments;
          });
        }
      } catch (error) {
        console.error('Error handling drag end:', error);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault();
    const cellKey = `${day}-${timeSlot}`;
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'grid-cell') {
        // Moving or duplicating an existing assignment
        if (data.cellKey !== cellKey && !assignments[cellKey]) {
          setAssignments(prev => {
            const newAssignments = { ...prev };
            // Only remove the original if not duplicating
            if (!data.isDuplicating) {
              delete newAssignments[data.cellKey];
            }
            newAssignments[cellKey] = data.assignment;
            return newAssignments;
          });
        }
      } else {
        // New assignment from activity list
        if (!assignments[cellKey]) {
          setAssignments(prev => ({
            ...prev,
            [cellKey]: data
          }));
        }
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleMenuClick = (e, day, timeSlot) => {
    e.stopPropagation();  // Prevent cell click event
    const cellKey = `${day}-${timeSlot}`;
    if (assignments[cellKey]) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        day,
        timeSlot
      });
    }
  };

  const handleDeleteActivity = (day, timeSlot) => {
    const cellKey = `${day}-${timeSlot}`;
    setAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[cellKey];
      return newAssignments;
    });
    setContextMenu(null);  // Close menu after action
  };

  const handleDuplicateToAllDays = (sourceDay, sourceTimeSlot) => {
    const sourceKey = `${sourceDay}-${sourceTimeSlot}`;
    const sourceAssignment = assignments[sourceKey];
    
    setAssignments(prev => {
      const newAssignments = { ...prev };
      // Add the assignment to the same time slot for all days
      daysOfWeek.forEach(day => {
        const targetKey = `${day}-${sourceTimeSlot}`;
        // Skip if there's already an assignment or if it's the source day
        if (!newAssignments[targetKey] && day !== sourceDay) {
          newAssignments[targetKey] = sourceAssignment;
        }
      });
      return newAssignments;
    });
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  const handleClick = () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  return (
    <>
      <div className="time-grid-container" onClick={handleClick}>
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
                    <>
                      <span className="cell-activity-name">{assignment.name}</span>
                      <div 
                        className="cell-controls"
                        style={{
                          '--cell-color': assignment.color
                        }}
                      >
                        <span 
                          className="cell-handle move"
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, day, timeSlot, false)}
                          title="Drag to move"
                        />
                        <span 
                          className="cell-handle duplicate"
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, day, timeSlot, true)}
                          title="Drag to duplicate"
                        />
                        <span 
                          className="cell-menu-icon"
                          onClick={(e) => handleMenuClick(e, day, timeSlot)}
                          title="More options"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <div 
            className="context-menu-item"
            onClick={() => handleDuplicateToAllDays(contextMenu.day, contextMenu.timeSlot)}
          >
            Duplicate to All Days
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleDeleteActivity(contextMenu.day, contextMenu.timeSlot)}
          >
            Delete Activity
          </div>
        </div>
      )}
    </>
  );
} 