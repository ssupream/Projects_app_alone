const newTaskBtn = document.querySelector(".js-add-new-task-btn");
const listContainer = document.querySelector(".list");
const noTasksText = document.querySelector(".no-tasks");

let listItems = JSON.parse(localStorage.getItem("todoList")) || [];

renderTasksList();

function renderTasksList() {
  let tasksHTML = "";
  listItems.forEach((task, index) => {
    tasksHTML += createTaskHTML(task, index);
  });

  listContainer.innerHTML = tasksHTML;

  if (listItems.length === 0) {
    noTasksText.classList.add("no-tasks");
  } else {
    noTasksText.classList.remove("no-tasks");
  }

  console.log(listItems);
}

function createTaskHTML(task, index) {
  return `
    <div class="task" data-task-index="${index}">
      <label class="form-control">
        <input type="checkbox" name="checkbox" />
        <input type="text" value="${
          task.title || ""
        }" placeholder="New Task" class="js-list-text"/>
        ${
          task.flagged
            ? '<div class="task-flagged js-task-flagged">⚑</div>'
            : ""
        }
        <button class="save-btn" onclick="saveTask(${index})">✅︎</button>      
        <button class="flag-btn" onclick="flagTask(${index})">⚑</button>
        <button class="del-btn js-del-btn" onclick="deleteTask(${index})">Delete</button>
      </label>
      <input type="date" class="js-due-date-input" value="${
        task.dueDate || formattedToday
      }" />
    </div>
  `;
}

function addTask() {
  const newTask = {
    title: "",
    dueDate: "",
  };
  listItems.push(newTask);
  renderTasksList();
}

function flagTask(index) {
  const task = listItems[index];
  task.flagged = !task.flagged;

  renderTasksList();
  storeTodoList();
}

function deleteTask(index) {
  listItems.splice(index, 1);
  renderTasksList();
  storeTodoList();
}

function saveTask(index) {
  const task = listItems[index];
  const taskTitleInput = (task.title = document.querySelector(
    `[data-task-index="${index}"] .js-list-text`
  ));
  const taskDueDateInput = (task.dueDate = document.querySelector(
    `[data-task-index="${index}"] .js-due-date-input`
  ));
  task.title = taskTitleInput.value || "New task";
  task.dueDate = taskDueDateInput.value || formattedToday;

  console.log(task);

  storeTodoList();
  renderTasksList();
}

const date = new Date();
let yyyy = date.getFullYear();
let mm = date.getMonth() + 1;
let dd = date.getDate();

if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}

const formattedToday = yyyy + "-" + mm + "-" + dd;

function storeTodoList() {
  localStorage.setItem("todoList", JSON.stringify(listItems));
}

newTaskBtn.addEventListener("click", addTask);
