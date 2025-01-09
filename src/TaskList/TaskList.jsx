import React, { useState, useEffect } from 'react';
import Task from "../Task/Task.jsx";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [status, setStatus] = useState('initial');

  useEffect(() => {
    setStatus('loading');

    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setStatus('success');
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === '') return;

    const previousTaskList = tasks
    const newTaskData = {
      userId: 1,
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskData]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTaskData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        setTasks(previousTaskList);
        throw new Error('Не удалось добавить задачу');
      }
    } catch (err) {
      alert(err)
    }
  };

  const handleDeleteTask = async (taskId) => {
    const previousTaskList = tasks

    const updatedTaskList = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTaskList);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setTasks(previousTaskList)
        throw new Error('Не удалось удалить задачу');
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleEditTask = async (taskId, updateData) => {
    const previousTaskList = tasks

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId)
        return { ...task, ...updateData };
      return task
    });
    setTasks(updatedTasks);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        setTasks(previousTaskList);
        throw Error('Не удалось обновить запись!')
      }
    } catch (err) {
      alert(err)
    }
  };

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="task-list">
      <h1>Список задач</h1>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Добавить новую задачу"
      />

      <button onClick={handleAddTask}>Добавить</button>

      <div className="tasks">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onToggle={handleEditTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
