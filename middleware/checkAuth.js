const {PrismaClient} = require("@prisma/client")
const db = new PrismaClient

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/reminders");
  },
  isAdmin: async function (req, res, next) {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id, 
      },
      select: {
        role: true, 
      },
    });
    if (req.isAuthenticated() && user.role === 'admin') {
      return next();
    }
    res.redirect("/auth/login");
  }
};




