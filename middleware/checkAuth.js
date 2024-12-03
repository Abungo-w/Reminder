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
    res.redirect("/dashboard");
  },
  isAdmin: async function (req, res, next) {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id, // Assume `req.user.id` holds the authenticated user's ID
      },
      select: {
        role: true, // Fetch only the `role` field
      },
    });
    if (req.isAuthenticated() && user.role === 'admin') {
      return next();
    }
    res.redirect("/auth/login");
  }
};
