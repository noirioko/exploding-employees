import { useState, useEffect } from 'react';

function EditTaskModal({ task, isOpen, onClose, onSave }) {
  const [editedTask, setEditedTask] = useState({
    text: '',
    category: 'art',
    deadline: '',
    energy: 'med',
    priority: false,
    recurrence: 'weekly',
    recurDay: 'sunday',
    recurDate: '1',
    recurDates: ['1', '15'],
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        text: task.text || '',
        category: task.category || 'art',
        deadline: task.deadline || '',
        energy: task.energy || 'med',
        priority: task.priority || false,
        recurrence: task.recurrence || 'weekly',
        recurDay: task.recurDay || 'sunday',
        recurDate: task.recurDate || '1',
        recurDates: task.recurDates || ['1', '15'],
      });
    }
  }, [task]);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>✏️ Edit Task</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="form-group">
          <label>Task Description</label>
          <textarea
            className="form-textarea"
            value={editedTask.text}
            onChange={(e) => setEditedTask({ ...editedTask, text: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            className="form-select"
            value={editedTask.category}
            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
          >
            <option value="art">🎨 Art</option>
            <option value="webtoon">📖 Webtoon</option>
            <option value="business">💼 Business</option>
            <option value="life">🏠 Life</option>
          </select>
        </div>
        {task?.taskType === 'recurring' ? (
          <>
            <div className="form-group">
              <label>Recurrence</label>
              <select
                className="form-select"
                value={editedTask.recurrence}
                onChange={(e) => setEditedTask({ ...editedTask, recurrence: e.target.value })}
              >
                <option value="daily">📅 Daily</option>
                <option value="weekly">📅 Weekly</option>
                <option value="bi-monthly">📅 Bi-monthly</option>
                <option value="monthly">📅 Monthly</option>
              </select>
            </div>
            {editedTask.recurrence === 'weekly' && (
              <div className="form-group">
                <label>Day of Week</label>
                <select
                  className="form-select"
                  value={editedTask.recurDay}
                  onChange={(e) => setEditedTask({ ...editedTask, recurDay: e.target.value })}
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
            )}
            {editedTask.recurrence === 'monthly' && (
              <div className="form-group">
                <label>Day of Month</label>
                <select
                  className="form-select"
                  value={editedTask.recurDate}
                  onChange={(e) => setEditedTask({ ...editedTask, recurDate: e.target.value })}
                >
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                    return <option key={day} value={String(day)}>{day}{suffix}</option>;
                  })}
                </select>
              </div>
            )}
            {editedTask.recurrence === 'bi-monthly' && (
              <div className="form-group">
                <label>Days of Month</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {editedTask.recurDates.map((date, idx) => (
                    <div key={`date-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <select
                        className="form-select"
                        value={date}
                        onChange={(e) => {
                          const newDates = [...editedTask.recurDates];
                          newDates[idx] = e.target.value;
                          setEditedTask({ ...editedTask, recurDates: newDates });
                        }}
                        style={{ width: '80px' }}
                      >
                        {[...Array(31)].map((_, i) => {
                          const day = i + 1;
                          const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                          return <option key={`date-${idx}-day-${day}`} value={String(day)}>{day}{suffix}</option>;
                        })}
                      </select>
                      {editedTask.recurDates.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newDates = editedTask.recurDates.filter((_, i) => i !== idx);
                            setEditedTask({ ...editedTask, recurDates: newDates });
                          }}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditedTask({ ...editedTask, recurDates: [...editedTask.recurDates, '1'] })}
                    style={{
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    + Add Date
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              className="form-input"
              value={editedTask.deadline}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
            />
          </div>
        )}
        <div className="form-group">
          <label>Energy Level</label>
          <select
            className="form-select"
            value={editedTask.energy}
            onChange={(e) => setEditedTask({ ...editedTask, energy: e.target.value })}
          >
            <option value="low">🔋 Low</option>
            <option value="med">☕ Medium</option>
            <option value="high">⚡ High</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.checked })}
            />
            <span>⚠️ Mark as URGENT/Priority</span>
          </label>
        </div>
        <button className="submit-btn" onClick={handleSave}>
          Save Changes 💕
        </button>
      </div>
    </div>
  );
}

export default EditTaskModal;
