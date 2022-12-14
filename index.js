const path = require("path");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];
const userTasks = {};

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.static(__dirname + "/public"));

app.get("/", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname));
});

app.get("/userName", checkAuthenticated, function (req, res) {
  if (userTasks[req.user.name]) {
    res.send({ name: req.user.name, tasks: userTasks[req.user.name] });
  } else {
    userTasks[req.user.name] = [];
    res.send({ name: req.user.name });
  }
});

app.post("/:user/tasks", function (req, res) {
  if (userTasks[req.params.user]) {
    if (req.body.tasks.length > 0) {
      userTasks[req.params.user].push(req.body.tasks);
    }
  } else {
    userTasks[req.params.user] = null;
  }
});

app.post("/:user/add-task", function (req, res) {
  try {
    if (userTasks[req.user.name].indexOf(req.body.task) === -1) {
      userTasks[req.user.name].push(req.body.task);
      res
        .status(200)
        .json({ success: `Task (${req.body.task}) added successfully!` });
    } else {
      res
        .status(404)
        .json({
          message: `Task (${req.body.task}) already present in the stack!`,
        });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add task" });
  }
});

app.post("/:user/delete-task", function (req, res) {
  try {
    let index = userTasks[req.params.user].indexOf(req.body.task);
    userTasks[req.params.user].splice(index, 1);
    res.status(200).json({ deletedTask: req.body.task });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

app.delete("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return err;
    }
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);
