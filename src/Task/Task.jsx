import React, { useState } from 'react';

function Task({ task, onDelete, onEdit, onToggle }) {
  const [isEdit, setIsEdit] = useState(false);
  const [newText, setNewText] = useState(null);

  const handleEditChange = (e) => setNewText(e.target.value);

  const handleSave = () => {
    onEdit(task.id, newText);
    setNewText(null)
    setIsEdit(false);
  };

  const handleEdit = () => {
    setNewText(task.title)
    setIsEdit(true)
  }

  return (
    <div className="task">
      <input
        className={isEdit && 'hide'}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
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

      <button onClick={isEdit ? handleSave : handleEdit}>
        {!isEdit ? 'Редактировать' : 'Сохранить' }
      </button>
    </div>
  );
}

export default Task;
