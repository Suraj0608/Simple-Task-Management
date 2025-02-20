import React, { useState } from 'react';
//import './index.css'; // We'll define this CSS file next

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Do Homework', description: 'Maths Assignment\nPhysics Problem Solve\nChemistry Revision', priority: 'High', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [showCompleted, setShowCompleted] = useState(false);

  const addTask = () => {
    if (newTask.trim() === '') return;
    const task = {
      id: Date.now(),
      title: newTask,
      description: '',
      priority: priority,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const completeTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const displayedTasks = showCompleted
    ? tasks.filter(task => task.completed)
    : tasks.filter(task => !task.completed);

  return (
    <div className="task-manager">
      {/* Header */}
      <div className="header">
        <h1>TASK MANAGER</h1>
      </div>

      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={!showCompleted ? 'active' : ''}
            onClick={() => setShowCompleted(false)}
          >
            Tasks
          </button>
          <button
            className={showCompleted ? 'active' : ''}
            onClick={() => setShowCompleted(true)}
          >
            Complete Tasks
          </button>
        </div>

        {/* Main Content */}
        <div className="content">
          {/* Add Task Form */}
          <div className="add-task-container">
            <h2>My Tasks</h2>
            <div className="task-form">
              <input
                type="text"
                placeholder="Add New Task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <div className="form-actions">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <button
                  className="add-button"
                  onClick={addTask}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="tasks-table">
            <div className="table-header">
              <div className="column">Title</div>
              <div className="column">Description</div>
              <div className="column">Sort By</div>
              <div className="column">Action</div>
            </div>

            {displayedTasks.map(task => (
              <div key={task.id} className="table-row">
                <div className="column title">
                  <span className="bullet"></span>
                  {task.title}
                </div>
                <div className="column description">{task.description}</div>
                <div className="column">{task.priority}</div>
                <div className="column actions">
                  {!task.completed && (
                    <>
                      <button
                        className="complete-button"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </button>
                      <span className="separator">|</span>
                    </>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {displayedTasks.length === 0 && (
              <div className="empty-message">
                {showCompleted ? "No completed tasks" : "No pending tasks"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
