const { PrismaClient} = require("@prisma/client")
const db = new PrismaClient();

const userModel = {
  findOne: async (email) => {
    const user = await db.user.findUnique({ where: { email: email }});
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: async (id) => {
    const user = await db.user.findUnique({ where: { id: id }});
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
};

module.exports = { userModel };
