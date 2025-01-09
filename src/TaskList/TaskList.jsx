import React, { useState, useEffect } from 'react';
import Task from "../Task/Task.jsx";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [status, setStatus] = useState('initial');
  const [errorData, setErrorData] = useState('');

  useEffect(() => {
    setStatus('loading');

    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setStatus('success');
      })
      .catch((err) => {
        setErrorData(err);
        setStatus('error');
      });
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === '') return;

    const newTaskData = {
      userId: 1,
      title: newTask,
      completed: false,
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTaskData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const newTask = await response.json();

      setTasks([...tasks, newTask]);
    } catch (err) {
      setErrorData(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedTaskList = tasks.filter((task) => task.id !== taskId)
        setTasks(updatedTaskList);
      } else {
        throw new Error('Не удалось удалить задачу');
      }
    } catch (err) {
      setErrorData(err);
    }
  };

  const handleEditTask = async (taskId, newText) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: newText,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId)
            return { ...task, title: newText };
          return task
        });

        setTasks(updatedTasks);
      } else {
        throw new Error('Не удалось обновить задачу');
      }
    } catch (err) {
      setErrorData(err);
    }
  };

  const handleToggleTask = async (taskId, isCompleted) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          completed: isCompleted,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId)
            return { ...task, completed: isCompleted };
          return task
        });

        setTasks(updatedTasks);
      } else {
        throw new Error('Не удалось обновить задачу');
      }
    } catch (err) {
      setErrorData(err);
    }
  };

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'error') {
    return <div>{errorData.message}</div>;
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
            onToggle={handleToggleTask}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
