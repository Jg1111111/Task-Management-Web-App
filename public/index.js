console.log('index.js')

    // Function to add a task to the list
    function addTaskToList(task) {
      const taskList = document.getElementById('taskList');
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.setAttribute('data-id', task._id);

      const taskContent = `
        <div>
          <h5>${task.title}</h5>
          <p>${task.description}</p>
          <small>Due: ${task.dueDate}</small>
        </div>
      `;
      listItem.innerHTML = taskContent;

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-secondary btn-sm ml-auto mr-2';
      editBtn.textContent = 'Edit';
      editBtn.onclick = function() {
        editTask(task);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = function() {
        deleteTask(task._id, listItem);
      };

      listItem.appendChild(editBtn);
      listItem.appendChild(deleteBtn);
      listItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'my-2');
      taskList.appendChild(listItem);
    }

    // Fetch tasks from API and add to list
    async function fetchTasks() {
      try {
        const response = await fetch('http://127.0.0.1:3001/task');
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');

  // Clear existing HTML content inside taskList
  taskList.innerHTML = '';
        tasks.forEach(task => addTaskToList(task));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    // Edit task
    function editTask(task) {
        document.getElementById('taskHeader').scrollIntoView({ behavior: 'smooth' })
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDescription').value = task.description;
      document.getElementById('taskDueDate').value = task.dueDate;
      document.getElementById('submit').innerText = 'Update Task';
      
      document.getElementById('taskForm').onsubmit = async function(e) {
          e.preventDefault();
          document.getElementById('submit').innerText = 'Add Task';
        const updatedTask = {
          id: task._id,
          title: document.getElementById('taskTitle').value.trim(),
          description: document.getElementById('taskDescription').value.trim(),
          dueDate: document.getElementById('taskDueDate').value
        };
        await updateTask(updatedTask);
        fetchTasks()
        document.getElementById('taskForm').reset();
        document.querySelector(`[data-id='${task._id}']`).scrollIntoView({ behavior: 'smooth' })

      };
    }

    // Update task
    async function updateTask(task) {
      try {
        const response = await fetch(`http://127.0.0.1:3001/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
        const updatedTask = await response.json();
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary btn-sm ml-auto mr-2';
        editBtn.textContent = 'Edit';
        editBtn.onclick = function() {
          editTask(updatedTask);
        };
  
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
          deleteTask(updatedTask._id, listItem);
        };
  
        listItem.appendChild(editBtn);
        listItem.appendChild(deleteBtn);
        listItem.classList.add('d-flex', 'justify-content-between', 'align-items-center');

        document.getElementById('taskForm').reset();
        document.getElementById('taskForm').onsubmit = addTaskFormHandler;
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }

    // Delete task
    async function deleteTask(id, listItem) {
      try {
        await fetch(`tasks/${id}`, {
          method: 'DELETE'
        });
        document.getElementById('taskList').removeChild(listItem);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }

    // Initial fetch of tasks
    document.addEventListener('DOMContentLoaded', fetchTasks);

    // Form submission handler
    function addTaskFormHandler(e) {
      e.preventDefault();

      const taskTitle = document.getElementById('taskTitle').value.trim();
      const taskDescription = document.getElementById('taskDescription').value.trim();
      const taskDueDate = document.getElementById('taskDueDate').value;

      if (taskTitle === '' || taskDueDate === '') {
        alert('Title and due date are required!');
        return;
      }

      const task = {
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate
      };

      add(task);
      fetchTasks();
      document.getElementById('taskForm').reset();
    }

    document.getElementById('taskForm').onsubmit = addTaskFormHandler;
 


function add(task) {
    fetch('http://127.0.0.1:3001/add', {
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Indicate that the request body is JSON
        },
        body: JSON.stringify(task) // Convert the JavaScript object to a JSON string
    })
    .then(response => response.json()) // Parse the JSON from the response
    .then(data => {
        console.log('Success:', data); // Handle the response data
    })
    .catch(error => {
        console.error('Error:', error); // Handle any errors
    });
}