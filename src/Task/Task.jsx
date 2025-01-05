// src/Task.js
import React, { useState } from 'react';

function Task({ task, onDelete, onEdit, onToggle }) {
  const [isEdit, setIsEdit] = useState(false);
  const [newText, setNewText] = useState(task.title);

  const handleEditChange = (e) => setNewText(e.target.value);

  const handleSave = () => {
    onEdit(task.id, newText);
    setIsEdit(false);
  };

  return (
    <div className="task">
      <input
        className={isEdit && 'hide'}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      {isEdit ? (
        <input
          type="text"
          value={newText}
          onChange={handleEditChange}
        />
      ) : (
        <span className={task.completed ? 'completed' : ''}>{task.title}</span>
      )}

      <button onClick={() => onDelete(task.id)}>Удалить</button>

      <button onClick={isEdit ? handleSave : () => setIsEdit(true)}>
        {!isEdit ? 'Редактировать' : 'Сохранить' }
      </button>
    </div>
  );
}

export default Task;
