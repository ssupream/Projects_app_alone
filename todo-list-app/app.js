const newTaskBtn = document.querySelector(".js-add-new-task-btn");
const newTaskBtnBefore = document.querySelector(".js-add-new-task-btn::before");
const listContainer = document.querySelector(".list");
const noTasksText = document.querySelector(".no-tasks");

const listTodayBtn = document.querySelector(".js-side-list-today");
const listScheduletBtn = document.querySelector(".js-side-list-scheduled");
const listAllBtn = document.querySelector(".js-side-list-all");
const listFlaggedBtn = document.querySelector(".js-side-list-flagged");
const listCompletedBtn = document.querySelector(".js-side-list-completed");
const listRemindersBtn = document.querySelector(".js-side-list-reminders");
const listToDoBtn = document.querySelector(".js-side-list-to-do");
let listTitle = "" || "To do";
let storageVariable = "" || "listSectionToDo";

let nTasksToday = 0;
let nTasksScheduled = 0;
let nTasksAll = 0;
let nTasksFlagged = 0;
let nTasksCompleted = 0;
let nTasksReminders = 0;
let nTasksTodo = 0;

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

let listIndex = "" || 6;

function getCurrentListSectionArray() {
  return Object.values(lists)[listIndex];
}

let listSectionArray = getCurrentListSectionArray();

let checked;

createHeading();
renderTasksList();

function renderTasksList() {
  let tasksHTML = "";
  listSectionArray.forEach((task, index) => {
    tasksHTML += createTaskHTML(task, index);
  });
  listContainer.innerHTML = tasksHTML;

  nTasksToday = 0;
  nTasksScheduled = 0;
  nTasksAll = 0;
  nTasksFlagged = 0;
  nTasksCompleted = 0;
  nTasksReminders = 0;
  nTasksTodo = 0;

  if (listSectionArray.length === 0) {
    noTasksText.classList.add("no-tasks");
  } else {
    noTasksText.classList.remove("no-tasks");
  }

  listContainer
    .querySelectorAll("input[name=checkbox]")
    .forEach((checkbox, index) => {
      checkbox.checked = listSectionArray[index].checked || false;
    });

  countTasksToday();
  countTasksScheduled();
  countTasksAll();
  countTasksFlagged();
  countTasksCompleted();
  countTasksReminders();
  countTasksTodo();

  console.log(listIndex, listSectionArray);
}

function renderTasksListCompleted() {
  let tasksHTML = "";
  listSectionArray.forEach((task, index) => {
    tasksHTML += createTaskHTMLCompleted(task, index);
  });
  listContainer.innerHTML = tasksHTML;

  nTasksToday = 0;
  nTasksScheduled = 0;
  nTasksAll = 0;
  nTasksFlagge = 0;
  nTasksCompleted = 0;
  nTasksReminders = 0;

  if (listSectionArray.length === 0) {
    noTasksText.classList.add("no-tasks");
  } else {
    noTasksText.classList.remove("no-tasks");
  }

  listContainer
    .querySelectorAll("input[name=checkbox]")
    .forEach((checkbox, index) => {
      checkbox.checked = listSectionArray[index].checked || false;
    });

  countTasksCompleted();
  console.log(listIndex, listSectionArray);
}

function createHeading(listTitle) {
  document.querySelector(
    ".container-heading"
  ).innerHTML = `<h1 class="heading">${listTitle || "To do"}</h1>`;
}

function createTaskHTML(task, index) {
  return ` 
    <div class="task" data-task-index="${index}">
        <label class="form-control">
        <input type="checkbox" name="checkbox" class="checkbox" onclick="checkCheckbox(${index})" ${checked}/>
        <input type="text" value="${
          task.title || ""
        }" placeholder="New Task" class="input js-list-text"/>
        ${
          task.flagged ? '<div class="task-flagged js-task-flagged"></div>' : ""
        }
        <button class="save-btn" onclick="saveTask(${index})">✅︎</button>      
        <button class="flag-btn" onclick="flagTask(${index})">⚑</button>
        <button class="del-btn js-del-btn" onclick="deleteTask(${index})">Delete</button>
      </label>
      <input type="date" class="date js-due-date-input" value="${
        task.dueDate || formattedToday
      }" />
    </div>
  `;
}

function createTaskHTMLCompleted(task, index) {
  return `
    <div class="task" data-task-index="${index}">
      <label class="form-control-completed">
        <div class="task-flex">
        <input type="checkbox" name="checkbox" onclick="checkCheckbox(${index})" ${checked}/>
        <input type="text" class="input-completed" value="${
          task.title || ""
        }" placeholder="New Task" class="js-list-text"/>
        </div>
        ${
          task.flagged
            ? '<div class="task-flagged-completed js-task-flagged"></div>'
            : ""
        }
        
      
        <p class="from-what-list">${task.list}</p>
        <div class="completed-date-completed"><p>Completed: </p> <input type="date" class="date-completed js-due-date-input" value="${
          task.dueDate || formattedToday
        }" /></div>
      </label>
    </div>
  `;
}

let timeId;

function checkCheckbox(index) {
  const checkbox = document.querySelector(
    `[data-task-index="${index}"] input[name=checkbox]`
  );

  let task = listSectionArray[index];

  let completed = lists.listSectionCompleted;

  if (checkbox.checked) {
    // clearTimeout(timeId);
    timeId = setTimeout(() => {
      checked = "checked";
      checkbox.classList.add("checkbox-completed");
      console.log("Checkbox is checked..");
      completed.push(task);
      storeTodoListCompleted();

      listSectionArray.splice(index, 1);

      storeTodoList();
      renderTasksList();
    }, 2000);
  } else {
    clearTimeout(timeId);
    console.log("Checkbox is not checked..");
  }
  task.checked = checkbox.checked;
  storeTodoList();
}

function addTask() {
  const newTask = {
    title: "",
    dueDate: "",
    list: "",
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

  task.list = listTitle;
  task.title = taskTitleInput.value || "New task";
  task.dueDate = taskDueDateInput.value || formattedToday;

  console.log(task);

  storeTodoList();
  renderTasksList();
}

function flagTask(index) {
  const flaggedTask = document.querySelector(
    `[data-task-index="${index}"] task-flagged`
  );
  const task = listSectionArray[index];
  task.flagged = !task.flagged;
  if (task.flagged) {
    const flaggedTaskList = lists.listSectionFlagged;
    flaggedTaskList.push(task);
    storeTodoListFlagged();
  } else if (!task.flagged) {
    console.log("Task unflagged");
  }

  storeTodoList();
  renderTasksList();
}

function deleteTask(index) {
  listSectionArray.splice(index, 1);
  renderTasksList();
  storeTodoList();
}

function countTasksToday() {
  for (i = 0; i < lists.listSectionToday.length; i++) {
    nTasksToday++;
  }
  document.getElementById("today-count").innerHTML = nTasksToday;
}

function countTasksCompleted() {
  for (i = 0; i < lists.listSectionCompleted.length; i++) {
    nTasksCompleted++;
  }
  document.getElementById("completed-count").innerHTML = nTasksCompleted;
}

function countTasksScheduled() {
  for (i = 0; i < lists.listSectionScheduled.length; i++) {
    nTasksScheduled++;
  }
  document.getElementById("scheduled-count").innerHTML = nTasksScheduled;
}

function countTasksAll() {
  for (i = 0; i < lists.listSectionAll.length; i++) {
    nTasksAll++;
  }
  document.getElementById("all-count").innerHTML = nTasksAll;
}

function countTasksFlagged() {
  for (i = 0; i < lists.listSectionFlagged.length; i++) {
    nTasksFlagged++;
  }
  document.getElementById("flagged-count").innerHTML = nTasksFlagged;
}

function countTasksCompleted() {
  for (i = 0; i < lists.listSectionCompleted.length; i++) {
    nTasksCompleted++;
  }
  document.getElementById("completed-count").innerHTML = nTasksCompleted;
}

function countTasksReminders() {
  for (i = 0; i < lists.listSectionReminder.length; i++) {
    nTasksReminders++;
  }
  document.getElementById("reminders-count").innerHTML = nTasksReminders + " ›";
}

function countTasksTodo() {
  for (i = 0; i < lists.listSectionToDo.length; i++) {
    nTasksTodo++;
  }
  document.getElementById("to-do-count").innerHTML = nTasksTodo + " ›";
}

function completedDeleteAllBtn() {
  document.querySelector(
    ".container-heading"
  ).innerHTML += `<div class="n-completed-clear"><p>${nTasksCompleted} Completed •</p><button class="clear-all-completed-tasks" onclick="deleteAll()">Clear</button></div>`;
}

function deleteAll() {
  const completed = lists.listSectionCompleted;
  completed.splice(0);
  renderTasksList();
  storeTodoListCompleted();
}

newTaskBtn.addEventListener("click", addTask);

listTodayBtn.addEventListener("click", function () {
  createHeading("Today");
  newTaskBtn.style.opacity = "1";
  const root = document.documentElement;
  root.style.setProperty("--color", "#4668ff");
  listIndex = 0;
  storageVariable = "listSectionToday";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listScheduletBtn.addEventListener("click", function () {
  createHeading("Scheduled");
  const root = document.documentElement;
  root.style.setProperty("--color", "#ff4646");
  newTaskBtn.style.opacity = "0";
  listIndex = 1;
  storageVariable = "listSectionScheduled";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listAllBtn.addEventListener("click", function () {
  createHeading("All");
  const root = document.documentElement;
  root.style.setProperty("--color", "#000000");
  newTaskBtn.style.opacity = "0";
  listIndex = 2;
  storageVariable = "listSectionAll";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listFlaggedBtn.addEventListener("click", function () {
  createHeading("Flagged");
  const root = document.documentElement;
  root.style.setProperty("--color", "rgb(238, 146, 8)");
  newTaskBtn.style.opacity = "1";
  listIndex = 3;
  storageVariable = "listSectionFlagged";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listCompletedBtn.addEventListener("click", function () {
  createHeading("Completed");
  const root = document.documentElement;
  root.style.setProperty("--color", "#575757");
  newTaskBtn.style.opacity = "0";
  listIndex = 4;
  storageVariable = "listSectionCompleted";
  listSectionArray = getCurrentListSectionArray();
  renderTasksListCompleted();
  completedDeleteAllBtn();
});

listRemindersBtn.addEventListener("click", function () {
  createHeading("Reminders");
  const root = document.documentElement;
  root.style.setProperty("--color", "rgb(238, 146, 8)");
  newTaskBtn.style.opacity = "1";
  listIndex = 5;
  storageVariable = "listSectionReminder";
  listSectionArray = getCurrentListSectionArray();
  renderTasksList();
});

listToDoBtn.addEventListener("click", function () {
  createHeading("To");
  const root = document.documentElement;
  root.style.setProperty("--color", "rgb(127, 8, 238)");
  newTaskBtn.style.opacity = "1";
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

function storeTodoListFlagged() {
  localStorage.setItem(
    "listSectionFlagged",
    JSON.stringify(lists.listSectionFlagged)
  );
}
