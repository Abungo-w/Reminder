const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
// const authController = require("./controller/auth_controller");
const session = require("express-session");
const { isAdmin } = require('./middleware/checkAuth');

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   const isLoggedIn = req.isAuthenticated();
//   next();
// })

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    }
  })
);

const passport = require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());

// Attach user to res.locals
app.use((req, res, next) => {
  res.locals.user = req.user || null; 
  next();
});

app.get('/navbar', (req, res) => {
  res.render('partials/navbar', { user: req.user });
});


app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});
// Routes start here

app.get("/reminders", reminderController.list);

app.get("/reminder/new", reminderController.new);

app.get("/reminder/:id", reminderController.listOne);

app.get("/reminder/:id/edit", reminderController.edit);

app.post("/reminder/", reminderController.create);

// Implement this yourself
app.post("/reminder/update/:id", reminderController.update);

// Implement this yourself
app.post("/reminder/delete/:id", reminderController.delete);

// We will fix this soon.
// app.get("/register", authController.register);
app.get("/auth/login", (req, res) => {
  res.render("auth/login")
});
// app.post("/register", authController.registerSubmit);

app.post("/auth/login", passport.authenticate("local", {
  successRedirect: "/reminders",
  failureRedirect: "/auth/login",
}));

app.get("/admin", isAdmin, (req, res) => {
  const sessions = [];

  for (const sessionId in req.sessionStore.sessions) {
    const sessionData = JSON.parse(req.sessionStore.sessions[sessionId]);
    sessions.push({
      sessionId,
      userId: sessionData.passport.user,
    });
  }

  res.render("admin", {
    user: req.user,
    sessions,
  });
});

app.post('/admin/:sessionId', isAdmin, (req, res) => {
  const sessionId = req.params.sessionId;
  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      return res.status(500).send('Could not revoke session');
    }
    res.redirect('/admin');
  });
});

app.get('/navbar', (req, res) => {
  res.render('partials/navbar', { user: req.user });
});


app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
