const {PrismaClient} = require("@prisma/client")
const db = new PrismaClient

let remindersController = {
  list: async (req, res) => {
    const reminder = await db.reminder.findMany({
      where: {
        userId: req.user.id
      }
    })
    res.render("reminder/index", { reminders: reminder });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },

  create: async (req, res) => {
    const userID = req.user.id
    await db.reminder.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        completed: false,
        user: {connect:{id: userID}}
      }
    })
    req.user.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implement this code
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let reminder = {
      id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    req.user.reminders[searchResult] = reminder;
    res.redirect("/reminders");
  },

  delete: (req, res) => {
    let reminderToFind = req.params.id;
    req.user.reminders = req.user.reminders.filter(reminder => reminder.id != reminderToFind);
    res.redirect('/reminders');
  }}

module.exports = remindersController;
