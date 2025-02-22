import React, { useState, useEffect } from 'react';
import './Tasks.css';

const Tasks1 = () => {
      const [tasks, setTasks] = useState([]);
      const [newTask, setNewTask] = useState({
            title: '',
            description: '',
            priority: 'High'
      });
      const [filter, setFilter] = useState('All');
      const [activeTab, setActiveTab] = useState('tasks');
      const [darkMode, setDarkMode] = useState(false);

      // Priority weights for sorting
      const priorityWeight = {
            'High': 3,
            'Medium': 2,
            'Low': 1
      };

      useEffect(() => {
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme === 'enabled') {
                  setDarkMode(true);
            }
      }, []);

      const toggleDarkMode = () => {
            setDarkMode((prev) => {
                  const newMode = !prev;
                  localStorage.setItem('darkMode', newMode ? 'enabled' : 'disabled');
                  return newMode;
            });
      };

      // Sort tasks by priority
      const sortByPriority = (tasksToSort) => {
            return [...tasksToSort].sort((a, b) => {
                  // First sort by priority
                  const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
                  if (priorityDiff !== 0) return priorityDiff;

                  // If priorities are equal, sort by completion status
                  if (a.completed !== b.completed) return a.completed ? 1 : -1;

                  // If completion status is equal, sort by id (most recent first)
                  return b.id - a.id;
            });
      };

      const [taksUpdated, setTaksUpdated] = useState(false);

      // Load initial data from localStorage and then fetch from backend
      useEffect(() => {
            const loadTasks = async () => {
                  // First load from localStorage
                  const localTasks = localStorage.getItem('tasks');
                  if (localTasks) {
                        setTasks(sortByPriority(JSON.parse(localTasks)));
                  }

                  // Then fetch from backend
                  try {
                        const response = await fetch('http://localhost:5000/tasks');
                        const data = await response.json();
                        const sortedData = sortByPriority(data);
                        setTasks(sortedData);
                        localStorage.setItem('tasks', JSON.stringify(sortedData));
                  } catch (error) {
                        console.error('Error fetching tasks:', error);
                  }
            };

            loadTasks();
      }, [taksUpdated]);

      // Update localStorage whenever tasks change
      useEffect(() => {
            localStorage.setItem('tasks', JSON.stringify(tasks));
      }, [tasks]);

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!newTask.title.trim()) {
                  alert('Please enter a task title');
                  return;
            }

            try {
                  const response = await fetch('http://localhost:5000/tasks', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newTask),
                  });

                  if (response.ok) {
                        const newTaskData = await response.json();
                        // Update local state and localStorage with sorted tasks
                        const updatedTasks = sortByPriority([...tasks, newTaskData]);
                        setTasks(updatedTasks);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

                        setNewTask({
                              title: '',
                              description: '',
                              priority: 'High'
                        });
                  }
            } catch (error) {
                  console.error('Error adding task:', error);
            }
      };

      const toggleComplete = async (id, completed) => {
            try {
                  const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                        method: 'PUT',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ completed: !completed }),
                  });

                  if (response.ok) {
                        const updatedTask = await response.json();
                        // Update local state and localStorage with sorted tasks
                        const updatedTasks = sortByPriority(
                              tasks.map(task => task.id === id ? updatedTask : task)
                        );
                        setTasks(updatedTasks);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                  }
            } catch (error) {
                  console.error('Error updating task:', error);
            }
      };

      const deleteTask = async (id) => {
            try {
                  const response = await fetch(`http://localhost:5000/tasks/${id}`, {
                        method: 'DELETE',
                  });

                  if (response.ok) {
                        // Update local state and localStorage
                        const updatedTasks = tasks.filter(task => task.id !== id);
                        setTasks(updatedTasks);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                  }
            } catch (error) {
                  console.error('Error deleting task:', error);
            }
      };

      // Filter tasks after sorting by priority
      const filteredTasks = tasks.filter(task => {
            if (activeTab === 'completed') return task.completed;
            if (!task.completed) {
                  if (filter === 'All') return true;
                  return task.priority === filter;
            }
            return false;
      });

      const [editmode, setEditmode] = useState(false);
      const [updatedTask, setupdatedTask] = useState({
            title: '',
            description: '',
            priority: ''
      });
      const [selectedId, setSetselectedId] = useState(0);

      const handleEdit = (task) => {
            setSetselectedId(task.id);
            setupdatedTask({
                  title: task.title,
                  description: task.description,
                  priority: task.priority
            });
            setEditmode(!editmode);
      };

      const handleCancelUpdateTask = () => {
            setEditmode(!editmode);
            setSetselectedId(0);
            setupdatedTask({
                  title: '',
                  description: '',
                  priority: ''
            });
      };

      const handleComplete = async (task) => {
            try {
                  const response = await fetch(`http://localhost:5000/tasks/update/${task.id}`, {
                        method: 'PUT',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedTask),
                  });

                  if (response.ok) {
                        setTaksUpdated(prev => !prev); // Toggle to trigger useEffect
                        setSetselectedId(0);
                        setEditmode(!editmode);
                        setupdatedTask({
                              title: '',
                              description: '',
                              priority: ''
                        });
                  }
            } catch (error) {
                  console.log('Error updating task:', error);
            }
      };

      return (
            <div className={`container ${darkMode ? 'dark' : ''}`}>
                  <header className="header">
                        <img src="Logo.png" alt="" style={{ height: '2.6rem', marginTop: '0.5rem' }} />
                        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                              {darkMode ? <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/do-not-disturb-2.png" alt="do-not-disturb-2" /> : <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/do-not-disturb-2.png" alt="do-not-disturb-2" />}
                        </button>
                  </header>

                  <div className="main-content">
                        <aside className="sidebar">
                              <button
                                    className={`sidebar-button ${activeTab === 'tasks' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('tasks')}
                              >
                                    Tasks
                              </button>
                              <button
                                    className={`sidebar-button ${activeTab === 'completed' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('completed')}
                              >
                                    Completed Tasks
                              </button>
                        </aside>

                        <main className="main">
                              {activeTab === 'tasks' && (
                                    <div className="task-form-container">
                                          <h2>My Tasks</h2>
                                          <form onSubmit={handleSubmit} className="task-form">
                                                <input
                                                      type="text"
                                                      placeholder="Enter Task's Title..."
                                                      value={newTask.title}
                                                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                />
                                                <textarea
                                                      placeholder="Enter Task's Description..."
                                                      value={newTask.description}
                                                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                />
                                                <select
                                                      value={newTask.priority}
                                                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                                >
                                                      <option>High</option>
                                                      <option>Medium</option>
                                                      <option>Low</option>
                                                </select>
                                                <button type="submit" className="add-button">
                                                      Add Task
                                                </button>
                                          </form>
                                    </div>
                              )}

                              <div className="tasks-container">
                                    <div className="tasks-header">
                                          <div className="header-title">Title</div>
                                          <div className="header-description">Description</div>
                                          <select
                                                className="filter-select"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                          >
                                                <option>All</option>
                                                <option>High</option>
                                                <option>Medium</option>
                                                <option>Low</option>
                                          </select>
                                          <div className="header-action">Action</div>
                                    </div>

                                    {filteredTasks.map((task) => (
                                          <div key={task.id} className="task-item">
                                                {task.id === selectedId ? (
                                                      <>
                                                            <input
                                                                  type="text"
                                                                  placeholder="Enter title"
                                                                  value={updatedTask.title}
                                                                  onChange={(e) => setupdatedTask({ ...updatedTask, title: e.target.value })}

                                                                  className='task-edit'
                                                            />
                                                            <input
                                                                  type="text"
                                                                  placeholder="Enter description"
                                                                  value={updatedTask.description}
                                                                  onChange={(e) => setupdatedTask({ ...updatedTask, description: e.target.value })}

                                                                  className='task-edit'
                                                            />
                                                            <select
                                                                  value={updatedTask.priority}
                                                                  onChange={(e) => setupdatedTask({ ...updatedTask, priority: e.target.value })}

                                                                  className='task-edit'
                                                            >
                                                                  <option value="High">High</option>
                                                                  <option value="Medium">Medium</option>
                                                                  <option value="Low">Low</option>
                                                            </select>
                                                      </>
                                                ) : (
                                                      <>
                                                            <div className="task-title">{task.title}</div>
                                                            <div className="task-description">{task.description}</div>
                                                            <div className={`task-priority priority-${task.priority.toLowerCase()}`}>
                                                                  {task.priority}
                                                            </div>
                                                      </>
                                                )}
                                                <div className="task-actions">
                                                      {!task.completed ? (
                                                            <button
                                                                  onClick={() => toggleComplete(task.id, task.completed)}
                                                                  className="complete-btn"
                                                            >
                                                                  <img width="30" height="30" src="https://img.icons8.com/color/48/task-completed.png" alt="task-completed" />
                                                            </button>
                                                      ) :
                                                      (
                                                            <button
                                                                  onClick={() => toggleComplete(task.id, task.completed)}
                                                                  className="complete-btn"
                                                            >
                                                                  <img width="30" height="30" src="https://img.icons8.com/color/48/undo.png" alt="undo"/>
                                                            </button>
                                                      )
                                                }

                                                      {task.id === selectedId ? (
                                                            <button
                                                                  onClick={() => handleCancelUpdateTask()}
                                                                  className="delete-btn"
                                                            >
                                                                  <img width="22" height="22" src="https://t3.ftcdn.net/jpg/03/40/25/18/360_F_340251800_LCwH7U3LFo7DUnGNbpEKX5frMJJD8a6J.jpg" alt="create-new" />
                                                            </button>
                                                      ) : (
                                                            <button
                                                                  onClick={() => deleteTask(task.id)}
                                                                  className="delete-btn"
                                                            >
                                                                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                                                        <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                                                                  </svg>
                                                            </button>
                                                      )}
                                                      {task.id === selectedId ? (
                                                            <button onClick={() => handleComplete(task)} className="edit-btn tick">
                                                                  <img width="22" height="22" src="https://static.vecteezy.com/system/resources/thumbnails/008/134/818/small/check-mark-icon-checkmark-right-symbol-tick-sign-ok-button-correct-circle-icon-free-vector.jpg" alt="create-new" />
                                                            </button>
                                                      ) : (
                                                            <button onClick={() => handleEdit(task)} className="edit-btn">
                                                                  <img width="30" height="30"
                                                                        src="https://img.icons8.com/plasticine/100/create-new.png" alt="create-new" />
                                                            </button>
                                                      )}
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </main>
                  </div>
            </div>
      );
};

export default Tasks1;
