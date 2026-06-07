const STORAGE_KEY = "todoListApptasks";

const elements = {
  form: document.querySelector('form[name="newtask"]'),
  input: document.getElementById('newtask'),
  dateInput: document.getElementById('task-date'),
  list: document.getElementById('task-list'),
};

let tasks = [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored):[];
}

function createTaskItem(task, index) {
  const li = document.createElement('li');
  if (task.completed) {
    li.classList.add('done');
  }

  const textSpan = document.createElement('span');
  textSpan.textContent = task.text;

  const dateSpan = document.createElement('span');
  if (task.date) {
    dateSpan.className = 'task-date';
    dateSpan.textContent = task.date;
  }

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const completeButton = document.createElement('button');
  completeButton.type = 'button';
  completeButton.textContent = task.completed ?'Undo':'Complete';
  completeButton.addEventListener('click', () => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  actions.append(completeButton, deleteButton);
  li.append(textSpan, dateSpan, actions);
  return li;
}

function renderTasks() {
  elements.list.innerHTML = '';

  if (tasks.length === 0) {
    const placeholder = document.createElement('li');
    placeholder.textContent = 'No tasks yet. Add one above.';
    placeholder.style.color = '#6c757d';
    placeholder.style.fontStyle = 'italic';
    placeholder.style.background = 'transparent';
    placeholder.style.border = 'none';
    placeholder.style.padding = '0';
    elements.list.appendChild(placeholder);
    return;
  }

  tasks.forEach((task, index) => {
    elements.list.appendChild(createTaskItem(task, index));
  });
}

function addTask(text, date) {
  tasks.push({text, date, completed: false});
  saveTasks();
  renderTasks();
}

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();

  const trimmed = elements.input.value.trim();
  if (!trimmed) {
    return;
  }

  addTask(trimmed, elements.dateInput.value);
  elements.input.value = '';
  elements.dateInput.value = '';
  elements.input.focus();
});

window.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();
});
