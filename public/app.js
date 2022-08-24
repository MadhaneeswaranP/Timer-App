const user = {
  name: "",
  tasks: [],
};

let render_tasks = [];

const hostname = window.location.href

fetch(`${hostname}userName`)
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
    console.log("From backend Tasks", user.tasks);
    if (user.tasks.length > 0) {
      for (let i = 0; i < user.tasks.length; i++) {
        let value = user.tasks[i].split(" Time: ");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(value[0]));
        ul.appendChild(li);

        var delBtn = document.createElement("button");
        delBtn.innerHTML =
          "<i class='fa fa-trash' v-b-tooltip.hover title='Delete'></i>";

        li.appendChild(delBtn);
        delBtn.addEventListener("click", deleteListItem);

        // Add timer
        var timerSpan = document.createElement("span");
        timerSpan.setAttribute("id", "stopWatchDisplay");
        timerSpan.classList.add("timerDisplay");
        timerSpan.innerHTML = "Time: " + value[1];
        li.appendChild(timerSpan);

        function deleteListItem() {
          fetch(`${hostname}${user.name}/delete-task`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task: li.innerText.split("\n").join(" Time: "),
            }),
          })
            .then((response) => console.log(response.json()))
            .then((json) => console.log(json))
            .catch(function (err) {
              console.error(err);
            });

          let index = user.tasks.indexOf(li.innerText);
          user.tasks.splice(index, 1);
          li.classList.add("delete");
        }
      }
    }
  })
  .catch(function (err) {
    console.warn("Something went wrong.", err);
    window.location.replace(`${hostname}login`);
  });

var enter_btn = document.getElementById("new-task-submit");
enter_btn.addEventListener("click", createTaskPanel);
var input = document.getElementById("new-task-input");
var ul = document.querySelector("ul");

function createTaskPanel() {
  var time = 0;
  var running = 0;

  var resetTimer = false;
  // Create a task
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(input.value));
  ul.appendChild(li);

  // Clear text input field
  input.value = "";
  var delBtn = document.createElement("button");
  delBtn.innerHTML =
    "<i class='fa fa-trash' v-b-tooltip.hover title='Delete'></i>";

  li.appendChild(delBtn);
  delBtn.addEventListener("click", deleteListItem);

  // Add timer
  var timerSpan = document.createElement("span");
  timerSpan.setAttribute("id", "stopWatchDisplay");
  timerSpan.classList.add("timerDisplay");
  timerSpan.innerHTML = "00:00:00";
  li.appendChild(timerSpan);

  // Start button
  var startBtn = document.createElement("button");
  startBtn.innerHTML =
    "<span><i class='fa fa-play-circle' v-b-tooltip.hover title='Start'></i></span>";
  startBtn.setAttribute("id", "startBtn");
  li.appendChild(startBtn);
  startBtn.addEventListener("click", startTimer);

  var pauseBtn = document.createElement("button");
  pauseBtn.innerHTML =
    "<span><i class='fa fa-pause-circle' v-b-tooltip.hover title='Pause'></i></span>";
  pauseBtn.setAttribute("id", "pauseBtn");

  li.appendChild(pauseBtn);
  pauseBtn.addEventListener("click", pauseTimer);

  var stopBtn = document.createElement("button");
  stopBtn.innerHTML =
    "<span><i class='fa fa-check-circle' v-b-tooltip.hover title='Stop'></i></span>";
  stopBtn.setAttribute("id", "stopBtn");

  li.appendChild(stopBtn);
  stopBtn.addEventListener("click", stopTimer);

  function pauseTimer() {
    li.classList.add("paused");
    li.classList.remove("started");
    li.classList.remove("done");
    running = 0;
    startBtn.enabled = true;
    pauseBtn.enabled = false;
    stopBtn.enabled = true;
  }
  function startTimer() {
    if (resetTimer) {
      reset();
    }

    if (running == 0) {
      running = 1;
      increment(timerSpan);
      startBtn.enabled = false;
      pauseBtn.enabled = true;
      stopBtn.enabled = true;
    }

    li.classList.add("started");
    li.classList.remove("paused");
    li.classList.remove("done");
  }

  function stopTimer() {
    li.classList.add("done");
    li.classList.remove("paused");
    li.classList.remove("started");
    running = 0;
    startBtn.enabled = true;
    pauseBtn.enabled = false;
    stopBtn.enabled = false;
    resetTimer = true;

    // Push to tasks
    if (user.tasks.indexOf(li.innerText) === -1) {
      user.tasks.push(li.innerText.split("\n").join(" Time: "));

      setTimeout(() => {
        fetch(`${hostname}${user.name}/add-task`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: li.innerText.split("\n").join(" Time: "),
          }),
        })
          .then((response) => response.json())
          .then((json) => console.log(json))
          .catch(function (err) {
            console.error(err);
          });
      }, 1000);
    }
  }
  function reset() {
    running = 0;
    time = 0;
    resetTimer = false;
    timerSpan.innerHTML = "00:00:00";
  }
  function increment() {
    if (running == 1) {
      setTimeout(function () {
        time++;
        var mins = Math.floor(time / 10 / 60) % 60;
        var secs = Math.floor(time / 10) % 60;
        var tenths = time % 10;

        if (mins < 10) {
          mins = "0" + mins;
        }
        if (secs < 10) {
          secs = "0" + secs;
        }

        timerSpan.innerHTML = mins + ":" + secs + ":" + "0" + tenths;
        increment();
      }, 100);
    }
  }

  function deleteListItem() {
    fetch(`${hostname}${user.name}/delete-task`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: li.innerText.split("\n").join(" Time: ") }),
    })
      .then((response) => console.log(response.json()))
      .then((json) => console.log(json))
      .catch(function (err) {
        console.error(err);
      });

    let index = user.tasks.indexOf(li.innerText);
    user.tasks.splice(index, 1);
    li.classList.add("delete");
  }
}
