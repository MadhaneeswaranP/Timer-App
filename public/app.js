const user = {
  name: "",
  tasks: [],
};

let render_tasks = [];

const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");

fetch("http://localhost:3000/userName")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    user.name = data.name;
    document.getElementById("web-title").innerText =
      "Timer Application - " + data.name;
    document.getElementById("new-task-h2").innerText = "Welcome " + data.name;
    if (data.tasks.length > 1) {
      for (let i in data.tasks) {
        user.tasks.push(data.tasks[i]);
      }
    } else if (data.tasks.length === 1) {
      user.tasks.push(data.tasks[0]);
    }
    if (user.tasks.length > 0) {
      for (let i in user.tasks) {
        for (let j in user.tasks[i]) {
          render_tasks.push(user.tasks[i][j]);
        }
      }
      user.tasks = [...new Set(render_tasks)];
      for (let i = 0; i < user.tasks.length; i++) {
        const modal = document.getElementById("myModal");
        const span = document.getElementsByClassName("close")[0];

        const task_title = document.querySelector(".watch .task-title");

        /* Task */
        const task = user.tasks[i];
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
          // if (task_edit_el.innerText.toLowerCase() == "edit") {
          //   task_edit_el.innerText = "Save";
          //   task_input_el.removeAttribute("readonly");
          //   task_input_el.focus();
          // } else {
          //   task_edit_el.innerText = "Edit";
          //   task_input_el.setAttribute("readonly", "readonly");
          // }
          let time = task_input_el.value.split(". ")[1];
          let time_to_hrs = +time.split(":")[0] * 3600;
          let time_to_mins = +time.split(":")[1] * 60;
          let time_to_sec = +time.split(":")[2];
          modal.style.display = "block";
          task_title.innerHTML = task_input_el.value.split(". ")[0];
          stopWatch(time_to_hrs + time_to_mins + time_to_sec);
          console.log("On Edit", task, task_input_el.value.split(". ")[1]);
        });

        span.onclick = function () {
          task_input_el.value =
            task.split(". ")[0] + " Duration: " + stopWatch();
          user.tasks.push(
            task.split(". ")[0] +
              ". " +
              task_input_el.value.split("Duration: ")[1]
          );
          modal.style.display = "none";
        };

        task_delete_el.addEventListener("click", (e) => {
          list_el.removeChild(task_el);
          let index = user.tasks.indexOf(user.tasks[i]);
          user.tasks.splice(index, 1);
          // Delete user.tasks[i]
          fetch(`http://localhost:3000/${user.tasks[i]}/delete-task`, {
            method: "DELETE",
            body: user.tasks[i],
          }).then((response) => console.log(response.json()));
          console.log("In user history after deleting", user.tasks);
        });
      }
    }
  })
  .catch(function (err) {
    console.warn("Something went wrong.", err);
    window.location.replace("http://localhost:3000/login");
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];

  const task_title = document.querySelector(".watch .task-title");

  stopWatch();
  stopWatch.reset();

  /* Popup Stop Watch */
  modal.style.display = "block";

  /* Task name */
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
    // if (task_edit_el.innerText.toLowerCase() == "edit") {
    //   task_edit_el.innerText = "Save";
    //   task_input_el.removeAttribute("readonly");
    //   task_input_el.focus();
    // } else {
    //   task_edit_el.innerText = "Edit";
    //   task_input_el.setAttribute("readonly", "readonly");
    // }
    let time = task_input_el.value.split("Duration: ")[1];
    let time_to_hrs = +time.split(":")[0] * 3600;
    let time_to_mins = +time.split(":")[1] * 60;
    let time_to_sec = +time.split(":")[2];
    modal.style.display = "block";
    task_title.innerHTML = task_input_el.value.split("Duration: ")[0];
    stopWatch(time_to_hrs + time_to_mins + time_to_sec);
    console.log("On Edit", task, task_input_el.value.split("Duration: ")[1]);
  });

  span.onclick = function () {
    task_input_el.value = task + " Duration: " + stopWatch();
    user.tasks.push(task + " " + task_input_el.value.split("Duration: ")[1]);
    modal.style.display = "none";
  };

  task_delete_el.addEventListener("click", (e) => {
    list_el.removeChild(task_el);
    let index = user.tasks.indexOf(task_input_el.value);
    user.tasks.splice(index, 1);
    // Delete task_input_el.value
    fetch(`http://localhost:3000/${task_input_el.value}/delete-task`, {
      method: "DELETE",
      body: task_input_el.value,
    }).then((response) => console.log(response.json()));
    console.log("Form after deleting", user.tasks);
  });
});

const stopWatch = (sec) => {
  let given_sec = sec;
  let time_el = document.querySelector(".watch .time");
  const start_btn = document.getElementById("start");
  const stop_btn = document.getElementById("stop");
  const reset_btn = document.getElementById("reset");

  let seconds = given_sec ? given_sec : 0;
  let interval = null;

  console.log(
    "Inside StopWatch",
    "Seconds: " + seconds,
    "time: ",
    time_el.innerText
  );

  // if (!given_sec) {
  //   time_el.innerText = `00:00:00`
  //   return
  // }

  if (seconds !== 0) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - hrs * 3600) / 60);
    let secs = seconds % 60;

    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    if (hrs < 10) hrs = "0" + hrs;

    time_el.innerText = `${hrs}:${mins}:${secs}`;
  }

  // if (task_input && task_title) {
  //   task_input.value = task_title + " Duration: " + time_el.innerText;
  // }

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

  stopWatch.start = start;
  stopWatch.stop = stop;
  stopWatch.reset = reset;

  if (!given_sec) {
    return time_el.innerText;
  }
};

const logout_btn = document.getElementById("logout");

logout_btn.addEventListener("click", () => {
  fetch(`http://localhost:3000/${user.name}/tasks`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
});
