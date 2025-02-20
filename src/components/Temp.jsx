// import React, { useState, useEffect } from 'react';
// import './Tasks.css';

// const Temp = () => {
//       const [tasks, setTasks] = useState([]);
//       const [newTask, setNewTask] = useState({
//             title: '',
//             description: '',
//             priority: 'High'
//       });
//       const [filter, setFilter] = useState('All');
//       const [activeTab, setActiveTab] = useState('tasks');

//       // Priority weights for sorting
//       const priorityWeight = {
//             'High': 3,
//             'Medium': 2,
//             'Low': 1
//       };

//       // Sort tasks by priority
//       const sortByPriority = (tasksToSort) => {
//             return [...tasksToSort].sort((a, b) => {
//                   // First sort by priority
//                   const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
//                   if (priorityDiff !== 0) return priorityDiff;

//                   // If priorities are equal, sort by completion status
//                   if (a.completed !== b.completed) return a.completed ? 1 : -1;

//                   // If completion status is equal, sort by id (most recent first)
//                   return b.id - a.id;
//             });
//       };

//       // Load initial data from localStorage and then fetch from backend
//       useEffect(() => {
//             const loadTasks = async () => {
//                   // First load from localStorage
//                   const localTasks = localStorage.getItem('tasks');
//                   if (localTasks) {
//                         setTasks(sortByPriority(JSON.parse(localTasks)));
//                   }

//                   // Then fetch from backend
//                   try {
//                         const response = await fetch('http://localhost:5000/tasks');
//                         const data = await response.json();
//                         const sortedData = sortByPriority(data);
//                         setTasks(sortedData);
//                         localStorage.setItem('tasks', JSON.stringify(sortedData));
//                   } catch (error) {
//                         console.error('Error fetching tasks:', error);
//                   }
//             };

//             loadTasks();
//       }, []);

//       // Update localStorage whenever tasks change
//       useEffect(() => {
//             localStorage.setItem('tasks', JSON.stringify(tasks));
//       }, [tasks]);

//       const handleSubmit = async (e) => {
//             e.preventDefault();
//             if (!newTask.title.trim()) {
//                   alert('Please enter a task title');
//                   return;
//             }

//             try {
//                   const response = await fetch('http://localhost:5000/tasks', {
//                         method: 'POST',
//                         headers: {
//                               'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify(newTask),
//                   });

//                   if (response.ok) {
//                         const newTaskData = await response.json();
//                         // Update local state and localStorage with sorted tasks
//                         const updatedTasks = sortByPriority([...tasks, newTaskData]);
//                         setTasks(updatedTasks);
//                         localStorage.setItem('tasks', JSON.stringify(updatedTasks));

//                         setNewTask({
//                               title: '',
//                               description: '',
//                               priority: 'High'
//                         });
//                   }
//             } catch (error) {
//                   console.error('Error adding task:', error);
//             }
//       };

//       const toggleComplete = async (id, completed) => {
//             try {
//                   const response = await fetch(`http://localhost:5000/tasks/${id}`, {
//                         method: 'PUT',
//                         headers: {
//                               'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ completed: !completed }),
//                   });

//                   if (response.ok) {
//                         const updatedTask = await response.json();
//                         // Update local state and localStorage with sorted tasks
//                         const updatedTasks = sortByPriority(
//                               tasks.map(task => task.id === id ? updatedTask : task)
//                         );
//                         setTasks(updatedTasks);
//                         localStorage.setItem('tasks', JSON.stringify(updatedTasks));
//                   }
//             } catch (error) {
//                   console.error('Error updating task:', error);
//             }
//       };

//       const deleteTask = async (id) => {
//             try {
//                   const response = await fetch(`http://localhost:5000/tasks/${id}`, {
//                         method: 'DELETE',
//                   });

//                   if (response.ok) {
//                         // Update local state and localStorage
//                         const updatedTasks = tasks.filter(task => task.id !== id);
//                         setTasks(updatedTasks);
//                         localStorage.setItem('tasks', JSON.stringify(updatedTasks));
//                   }
//             } catch (error) {
//                   console.error('Error deleting task:', error);
//             }
//       };

//       // Filter tasks after sorting by priority
//       const filteredTasks = tasks.filter(task => {
//             if (activeTab === 'completed') return task.completed;
//             if (!task.completed) {
//                   if (filter === 'All') return true;
//                   return task.priority === filter;
//             }
//             return false;
//       });

//       // Rest of the component remains the same...
//       return (
//             <div className="container">
//                   <header className="header">
//                         <h1>TASK MANAGER</h1>
//                   </header>

//                   <div className="main-content">
//                         <aside className="sidebar">
//                               <button
//                                     className={`sidebar-button ${activeTab === 'tasks' ? 'active' : ''}`}
//                                     onClick={() => setActiveTab('tasks')}
//                               >
//                                     Tasks
//                               </button>
//                               <button
//                                     className={`sidebar-button ${activeTab === 'completed' ? 'active' : ''}`}
//                                     onClick={() => setActiveTab('completed')}
//                               >
//                                     Completed Tasks
//                               </button>
//                         </aside>

//                         <main className="main">
//                               {activeTab === 'tasks' && (
//                                     <div className="task-form-container">
//                                           <h2>My Tasks</h2>
//                                           <form onSubmit={handleSubmit} className="task-form">
//                                                 <input
//                                                       type="text"
//                                                       placeholder="Enter Task's Title..."
//                                                       value={newTask.title}
//                                                       onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                                                 />
//                                                 <textarea
//                                                       placeholder="Enter Task's Description..."
//                                                       value={newTask.description}
//                                                       onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//                                                 />
//                                                 <select
//                                                       value={newTask.priority}
//                                                       onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
//                                                 >
//                                                       <option>High</option>
//                                                       <option>Medium</option>
//                                                       <option>Low</option>
//                                                 </select>
//                                                 <button type="submit" className="add-button">
//                                                       Add Task
//                                                 </button>
//                                           </form>
//                                     </div>
//                               )}

//                               <div className="tasks-container">
//                                     <div className="tasks-header">
//                                           <div className="header-title">Title</div>
//                                           <div className="header-description">Description</div>
//                                           <select
//                                                 className="filter-select"
//                                                 value={filter}
//                                                 onChange={(e) => setFilter(e.target.value)}
//                                           >
//                                                 <option>All</option>
//                                                 <option>High</option>
//                                                 <option>Medium</option>
//                                                 <option>Low</option>
//                                           </select>
//                                           <div className="header-action">Action</div>
//                                     </div>

//                                     {filteredTasks.map((task) => (
//                                           <div key={task.id} className="task-item">
//                                                 <div className="task-title">{task.title}</div>
//                                                 <div className="task-description">{task.description}</div>
//                                                 <div className={`task-priority priority-${task.priority.toLowerCase()}`}>
//                                                       {task.priority}
//                                                 </div>
//                                                 <div className="task-actions">
//                                                       {!task.completed && (
//                                                             <button
//                                                                   onClick={() => toggleComplete(task.id, task.completed)}
//                                                                   className="complete-btn"
//                                                             >
//                                                                   Complete
//                                                             </button>
//                                                       )}

//                                                       <button
//                                                             onClick={() => deleteTask(task.id)}
//                                                             className="delete-btn"
//                                                       >
//                                                             Delete
//                                                       </button>
//                                                       <button className="edit-btn">Edit</button>
//                                                 </div>
//                                           </div>
//                                     ))}
//                               </div>
//                         </main>
//                   </div>
//             </div>
//       );
// };

// export default Temp;
