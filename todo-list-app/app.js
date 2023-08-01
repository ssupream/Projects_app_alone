const newTaskBtn = document.querySelector(".js-add-new-task-btn");
const listContainer = document.querySelector(".list");
const noTasksText = document.querySelector(".no-tasks");

const listTodayBtn = document.querySelector(".js-side-list-today");
const listScheduletBtn = document.querySelector(".js-side-list-scheduled");
const listAllBtn = document.querySelector(".js-side-list-all");
const listFlaggedBtn = document.querySelector(".js-side-list-flagged");
const listCompletedBtn = document.querySelector(".js-side-list-completed");
const listRemindersBtn = document.querySelector(".js-side-list-reminders");
const listToDoBtn = document.querySelector(".js-side-list-to-do");
let listTitle = "";
let storageVariable = "" || "listSectionToDo";

let lists = {
  listSectionToday: JSON.parse(localStorage.getItem("listSectionToday")) || [],
  listSectionScheduled:
    JSON.parse(localStorage.getItem("listSectionScheduled")) || [],
  listSectionAll: JSON.parse(localStorage.getItem("listSectionAll")) || [],
  listSectionFlagged:
    JSON.parse(localStorage.getItem("listSectionFlagged")) || [],
  listSectionCompleted:
    JSON.parse(localStorage.getItem("listSectionCompleted")) || [],
  listSectionReminder:
    JSON.parse(localStorage.getItem("listSectionReminder")) || [],
  listSectionToDo: JSON.parse(localStorage.getItem("listSectionToDo")) || [],
};

let listIndex = 6;

function getCurrentListSectionArray() {
  return Object.values(lists)[listIndex];
}

let listSectionArray = getCurrentListSectionArray();

createHeading();
renderTasksList();

function renderTasksList() {
  let tasksHTML = "";
  listSectionArray.forEach((task, index) => {
    tasksHTML += createTaskHTML(task, index);
  });
  listContainer.innerHTML = tasksHTML;

  if (listSectionArray.length === 0) {
    noTasksText.classList.add("no-tasks");
  } else {
    noTasksText.classList.remove("no-tasks");
  }

  console.log(listIndex, listSectionArray);
}

function createHeading(listTitle) {
  document.querySelector(
    ".container-heading"
  ).innerHTML = `<h1 class="to-do-heading">${
    listTitle || listToDoBtn.innerText
  }</h1>`;
}

function createTaskHTML(task, index) {
  return ` 
    <div class="task" data-task-index="${index}">
        <label class="form-control">
        <input type="checkbox" name="checkbox" onclick="checkCheckbox(${index})"/>
        <input type="text" value="${
          task.title || ""
        }" placeholder="New Task" class="js-list-text"/>
        ${
          task.flagged ? '<div class="task-flagged js-task-flagged"></div>' : ""
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

function checkCheckbox(index) {
  const checkbox = document.querySelector(
    `[data-task-index="${index}"] input[name=checkbox]`
  );

  if (checkbox.checked) {
    checkbox.setAttribute("checked", "checked");
    let completed = lists.listSectionCompleted;
    let task = listSectionArray[index];
    task.checked = completed.push(task);
    storeTodoListCompleted();
    listSectionArray.splice(index, 1);
    renderTasksList();
    storeTodoList();
  } else {
    console.log("Checkbox is not checked..");
  }
}

function addTask() {
  const newTask = {
    title: "",
    dueDate: "",
  };
  listSectionArray.push(newTask);
  storeTodoList();
  renderTasksList();
}

function saveTask(index) {
  const task = listSectionArray[index];
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

function flagTask(index) {
  const task = listSectionArray[index];
  task.flagged = !task.flagged;

  renderTasksList();
  storeTodoList();
}

function deleteTask(index) {
  listSectionArray.splice(index, 1);
  renderTasksList();
  storeTodoList();
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

newTaskBtn.addEventListener("click", addTask);

listTodayBtn.addEventListener("click", function () {
  createHeading(listTodayBtn.innerText);
  listIndex = 0;
  storageVariable = "listSectionToday";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listScheduletBtn.addEventListener("click", function () {
  createHeading(listScheduletBtn.innerText);
  listIndex = 1;
  storageVariable = "listSectionScheduled";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listAllBtn.addEventListener("click", function () {
  createHeading(listAllBtn.innerText);
  listIndex = 2;
  storageVariable = "listSectionAll";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listFlaggedBtn.addEventListener("click", function () {
  createHeading(listFlaggedBtn.innerText);
  listIndex = 3;
  storageVariable = "listSectionFlagged";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listCompletedBtn.addEventListener("click", function () {
  createHeading(listCompletedBtn.innerText);
  listIndex = 4;
  storageVariable = "listSectionCompleted";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listRemindersBtn.addEventListener("click", function () {
  createHeading(listRemindersBtn.innerText);
  listIndex = 5;
  storageVariable = "listSectionReminder";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listToDoBtn.addEventListener("click", function () {
  createHeading(listToDoBtn.innerText);
  listIndex = 6;
  storageVariable = "listSectionToDo";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

function storeTodoList() {
  localStorage.setItem(storageVariable, JSON.stringify(listSectionArray));
}

function storeTodoListCompleted() {
  localStorage.setItem(
    "listSectionCompleted",
    JSON.stringify(lists.listSectionCompleted)
  );
}
