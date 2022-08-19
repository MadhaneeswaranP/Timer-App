fetch("http://localhost:3000/userName")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    document.getElementById("web-title").innerText =
      "Timer Application - " + data.name;
    document.getElementById("new-task-h2").innerText = "Welcome " + data.name;
  })
  .catch(function (err) {
    console.warn("Something went wrong.", err);
  });

let time_el = document.querySelector(".watch .time");
const start_btn = document.getElementById("start");
const stop_btn = document.getElementById("stop");
const reset_btn = document.getElementById("reset");

let seconds = 0;
let interval = null;

// Event Listeners
start_btn.addEventListener("click", start);
stop_btn.addEventListener("click", stop);
reset_btn.addEventListener("click", reset);

// Update Timer
function timer() {
  seconds++;

  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds - hrs * 3600) / 60);
  let secs = seconds % 60;

  if (secs < 10) secs = "0" + secs;
  if (mins < 10) mins = "0" + mins;
  if (hrs < 10) hrs = "0" + hrs;

  time_el.innerText = `${hrs}:${mins}:${secs}`;
}

function start() {
  if (interval) return;

  interval = setInterval(timer, 1000);
}

function stop() {
  clearInterval(interval);
  interval = null;
}

function reset() {
  stop();
  seconds = 0;
  time_el.innerText = "00:00:00";
}

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
//   const btn = document.getElementById("new-task-submit");

  reset();

  /* Popup Stop Watch */
  modal.style.display = "block";

  const task_title = document.querySelector(".watch .task-title");

  // Task name
  const task = input.value + ".";
  task_title.innerHTML = task;
  const task_el = document.createElement("div");
  task_el.classList.add("task");

  const task_content_el = document.createElement("div");
  task_content_el.classList.add("content");

  task_el.appendChild(task_content_el);

  let task_input_el = document.createElement("input");
  task_input_el.classList.add("text");
  task_input_el.type = "text";
  task_input_el.value = task;
  task_input_el.setAttribute("readonly", "readonly");

  task_content_el.appendChild(task_input_el);

  const task_actions_el = document.createElement("div");
  task_actions_el.classList.add("actions");

  const task_edit_el = document.createElement("button");
  task_edit_el.classList.add("edit");
  task_edit_el.innerText = "Edit";

  const task_delete_el = document.createElement("button");
  task_delete_el.classList.add("delete");
  task_delete_el.innerText = "Delete";

  task_actions_el.appendChild(task_edit_el);
  task_actions_el.appendChild(task_delete_el);

  task_el.appendChild(task_actions_el);

  list_el.appendChild(task_el);

  input.value = "";

  task_edit_el.addEventListener("click", (e) => {
    if (task_edit_el.innerText.toLowerCase() == "edit") {
      task_edit_el.innerText = "Save";
      task_input_el.removeAttribute("readonly");
      task_input_el.focus();
    } else {
      task_edit_el.innerText = "Edit";
      task_input_el.setAttribute("readonly", "readonly");
    }
    // modal.style.display = "block";
    // time_el.innerHTML = task_input_el.value.split('Duration: ')[1]
    // console.log('On Edit', task_input_el.value.split('Duration: ')[1])
  });

  time_el.innerHTML = "00:00:00";

  span.onclick = function () {
    modal.style.display = "none";
  };

  task_delete_el.addEventListener("click", (e) => {
    list_el.removeChild(task_el);
  });

  window.onclick = function (event) {
    task_input_el.value = task + " Duration: " + time_el.innerHTML;
    // tasks.push({ task: task, time: time_el.innerHTML });
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});
