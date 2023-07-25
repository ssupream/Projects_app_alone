const newTaskBtn = document.querySelector(".js-add-new-task-btn");
const listContainer = document.querySelector(".list");
const noTasksText = document.querySelector(".no-tasks");
const html = `<input type="checkbox" name="checkbox" />
    <input type="text" placeholder="New Task" />
    <input type="date" class="js-due-date-input due-date-input" />
    <button class="details-btn">Details</button>
    <button class="flag-btn">Flag</button>
    <button class="del-btn js-del-btn">Delete</button>`;

let listItems = JSON.parse(localStorage.getItem("todoList")) || [];

renderTasksList();

function renderTasksList() {
  let tasksHTML = "";
  listItems.forEach(() => {
    tasksHTML += html;
    listContainer.innerHTML = `<label class="form-control">${tasksHTML}</label>`;
  });

  if (listItems.length === 0) {
    noTasksText.classList.add("no-tasks");
  } else {
    noTasksText.classList.remove("no-tasks");
  }

  console.log(listItems);
}

function addTask() {
  const form = document.createElement("label");
  form.classList.add("form-control");
  form.innerHTML = html;

  listItems.push(listContainer.appendChild(form));
  renderTasksList();
  storeTdoList();
}

function handleDeleteButtonClick(event) {
  if (event.target.classList.contains("js-del-btn")) {
    const button = event.target;
    const listItem = button.closest("label");
    const index = listItems.indexOf(listItem);

    if (index !== -1) {
      listItems.splice(index, 1);
      listItem.remove();
    }
  }
  if (listItems.length === 0) {
    noTasksText.classList.add("no-tasks");
  } else {
    noTasksText.classList.remove("no-tasks");
  }
  renderTasksList();
  storeTdoList();
}

function storeTdoList() {
  localStorage.setItem("todoList", JSON.stringify(listItems));
}

newTaskBtn.addEventListener("click", addTask);
listContainer.addEventListener("click", handleDeleteButtonClick);
