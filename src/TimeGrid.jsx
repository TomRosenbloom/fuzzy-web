import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './TimeGrid.css';

function Tooltip({ text, x, y, show }) {
  if (!show) return null;
  
  return ReactDOM.createPortal(
    <div 
      className="tooltip-portal"
      style={{
        position: 'fixed',
        top: y,
        left: x,
        transform: 'translate(-50%, -120%)',
        zIndex: 100000,
        pointerEvents: 'none'
      }}
    >
      {text}
    </div>,
    document.body
  );
}

export default function TimeGrid({ 
  blockSize, 
  startTime, 
  activities, 
  selectedActivity, 
  onActivitySelect,
  fuzziness = 0  // in minutes
}) {

  const [assignments, setAssignments] = useState({});  // Store cell assignments
  const [contextMenu, setContextMenu] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [selectedDays, setSelectedDays] = useState({});
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

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

  // Add useEffect to watch for fuzziness changes
  useEffect(() => {
    // Update all assignments when fuzziness changes
    setAssignments(prev => {
      const newAssignments = { ...prev };
      Object.keys(newAssignments).forEach(key => {
        newAssignments[key] = {
          ...newAssignments[key],
          fuzziness: fuzziness
        };
      });
      return newAssignments;
    });
  }, [fuzziness]);

  // Convert blockSize string to minutes
  const blockSizeInMinutes = {
    '30 minutes': 30,
    '1 hour': 60,
    '2 hours': 120
  }[blockSize] || 60;

  // Calculate cell height (30px per hour)
  const cellHeight = (blockSizeInMinutes / 60) * 60;

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
      const dataStr = e.dataTransfer.getData('application/json');
      const data = JSON.parse(dataStr);
      
      if (data.type === 'grid-cell') {
        // Moving or duplicating an existing assignment
        // Remove check for !assignments[cellKey] to allow overwriting
        setAssignments(prev => {
          const newAssignments = { ...prev };
          if (!data.isDuplicating) {
            delete newAssignments[data.cellKey];
          }
          newAssignments[cellKey] = {
            ...data.assignment,
            fuzziness: fuzziness
          };
          return newAssignments;
        });
      } else {
        // New assignment from activity list
        // Remove check for !assignments[cellKey] to allow overwriting
        setAssignments(prev => ({
          ...prev,
          [cellKey]: {
            name: data.name,
            color: data.color,
            fuzziness: fuzziness
          }
        }));
      }
      
      setDraggedCell(null);
      setDraggedActivity(null);
      setDragOverCell(null);
    } catch (error) {
      console.error('Error handling drop:', error);
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
    
    // Initialize selected days (all days except source day are selected)
    const initialSelectedDays = daysOfWeek.reduce((acc, day) => {
      acc[day] = day !== sourceDay;
      return acc;
    }, {});
    setSelectedDays(initialSelectedDays);

    // Show modal with day selection
    setDuplicateWarning({
      sourceDay,
      sourceTimeSlot,
      conflicts: daysOfWeek.filter(day => {
        const targetKey = `${day}-${sourceTimeSlot}`;
        return day !== sourceDay && assignments[targetKey];
      })
    });
  };

  const handleDuplicateConfirm = () => {
    const { sourceDay, sourceTimeSlot } = duplicateWarning;
    const sourceKey = `${sourceDay}-${sourceTimeSlot}`;
    const sourceAssignment = assignments[sourceKey];
    
    setAssignments(prev => {
      const newAssignments = { ...prev };
      Object.entries(selectedDays).forEach(([day, isSelected]) => {
        if (isSelected) {
          const targetKey = `${day}-${sourceTimeSlot}`;
          newAssignments[targetKey] = sourceAssignment;
        }
      });
      return newAssignments;
    });
    
    setDuplicateWarning(null);
    setContextMenu(null);
    setSelectedDays({});
  };

  // Close context menu when clicking outside
  const handleClick = () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  const getFuzzyBackground = (color, fuzzinessMinutes) => {
    // Limit fuzziness to 25% of block size
    const maxFuzziness = blockSizeInMinutes * 0.25;
    const limitedFuzziness = Math.min(fuzzinessMinutes, maxFuzziness);
    
    // Convert minutes to percentage
    const fuzzinessPercent = Math.min((limitedFuzziness / blockSizeInMinutes) * 100, 100);
    
    if (fuzzinessPercent === 0) return color;
    
    // Calculate gradient stops based on fuzziness percentage
    const gradientSize = Math.min(fuzzinessPercent * 2, 100);
    
    return `linear-gradient(
      to bottom,
      transparent 0%,
      ${color} ${gradientSize}%,
      ${color} ${100 - gradientSize}%,
      transparent 100%
    )`;
  };

  const handleHandleMouseEnter = (e, text) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const handleHandleMouseLeave = () => {
    setTooltip({ show: false, text: '', x: 0, y: 0 });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const handles = document.querySelectorAll('.cell-handle');
      handles.forEach(handle => {
        handle.style.setProperty('--tooltip-y', `${e.clientY - 20}px`);
        handle.style.setProperty('--tooltip-x', `${e.clientX}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div 
        className="time-grid-container" 
        onClick={handleClick}
        style={{
          '--cell-height': `${cellHeight}px`
        }}
      >
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
                  style={assignment ? {
                    background: getFuzzyBackground(assignment.color, fuzziness)
                  } : {}}
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
                          onDragStart={(e) => {
                            // Set drag data first
                            e.dataTransfer.setData('application/json', JSON.stringify({
                              type: 'grid-cell',
                              cellKey: `${day}-${timeSlot}`,
                              assignment: assignments[`${day}-${timeSlot}`]
                            }));

                            // Use the cell itself as drag image, but centered
                            const cell = e.target.closest('.grid-cell');
                            const cellWidth = cell.offsetWidth;
                            const cellHeight = cell.offsetHeight;
                            e.dataTransfer.setDragImage(cell, cellWidth / 2, cellHeight / 2);
                          }}
                          onMouseEnter={(e) => handleHandleMouseEnter(e, "Drag to move")}
                          onMouseLeave={handleHandleMouseLeave}
                        />
                        <span 
                          className="cell-handle duplicate"
                          draggable="true"
                          onDragStart={(e) => {
                            // Set drag data first
                            e.dataTransfer.setData('application/json', JSON.stringify({
                              type: 'grid-cell',
                              cellKey: `${day}-${timeSlot}`,
                              assignment: assignments[`${day}-${timeSlot}`],
                              isDuplicating: true
                            }));

                            // Use the cell itself as drag image, but centered
                            const cell = e.target.closest('.grid-cell');
                            const cellWidth = cell.offsetWidth;
                            const cellHeight = cell.offsetHeight;
                            e.dataTransfer.setDragImage(cell, cellWidth / 2, cellHeight / 2);
                          }}
                          onMouseEnter={(e) => handleHandleMouseEnter(e, "Drag to duplicate")}
                          onMouseLeave={handleHandleMouseLeave}
                        />
                        <span 
                          className="cell-menu-icon"
                          onClick={(e) => handleMenuClick(e, day, timeSlot)}
                          onMouseEnter={(e) => handleHandleMouseEnter(e, "More options")}
                          onMouseLeave={handleHandleMouseLeave}
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
            left: contextMenu.x
          }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <div 
            className="context-menu-item"
            onClick={() => handleDuplicateToAllDays(contextMenu.day, contextMenu.timeSlot)}
          >
            Duplicate to Other Days...
          </div>
          <div 
            className="context-menu-item"
            onClick={() => handleDeleteActivity(contextMenu.day, contextMenu.timeSlot)}
          >
            Delete Activity
          </div>
        </div>
      )}

      {/* Duplicate Selection Modal */}
      {duplicateWarning && (
        <div className="modal-overlay" onClick={() => setDuplicateWarning(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Duplicate Activity</h3>
            <p>Select days to duplicate this activity to:</p>
            
            <div className="day-selection">
              {daysOfWeek.map(day => (
                day !== duplicateWarning.sourceDay && (
                  <label key={day} className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDays[day]}
                      onChange={e => setSelectedDays(prev => ({
                        ...prev,
                        [day]: e.target.checked
                      }))}
                    />
                    <span className={assignments[`${day}-${duplicateWarning.sourceTimeSlot}`] ? 'has-conflict' : ''}>
                      {day}
                    </span>
                  </label>
                )
              ))}
            </div>

            {duplicateWarning.conflicts.length > 0 && (
              <p className="warning-text">
                Note: Selected days with existing activities will be overwritten.
              </p>
            )}

            <div className="modal-buttons">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setDuplicateWarning(null);
                  setSelectedDays({});
                }}
              >
                Cancel
              </button>
              <button 
                className="duplicate-btn"
                onClick={handleDuplicateConfirm}
                disabled={!Object.values(selectedDays).some(Boolean)}
              >
                Duplicate
              </button>
            </div>
          </div>
        </div>
      )}
      <Tooltip {...tooltip} />
    </>
  );
} 