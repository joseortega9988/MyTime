import React from 'react';


// Mid and low have a special with the propuse of the 3 priorities have 4 lettes 

const SortTasks = (tasks, sortBy) => {
    switch (sortBy) {
      case 'taskname':
        return tasks.sort((a, b) => a.taskname.localeCompare(b.taskname));
      case 'priority':
        return tasks.sort((a, b) => {
          const priorityOrder = { 'High': 1, 'Mid​ ': 2, 'Low​ ': 3 };
          return priorityOrder[a.priority[0]] - priorityOrder[b.priority[0]];
        });
      case 'date':
        return tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      default:
        return tasks;
    }
  };

export default SortTasks;




