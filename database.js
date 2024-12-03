// const database = [
//   {
//     id: 1,
//     name: "Jimmy Smith",
//     email: "jimmy123@gmail.com",
//     password: "jimmy123!",
//     role: "admin",
//     reminders: [ 
//       {
//       id: 1,
//       title: "buy milk",
//       description: "go to safeway and buy milk",
//       completed: false,
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: "Johnny Doe",
//     email: "johnny123@gmail.com",
//     password: "johnny123!",
//     role: "user",
//     reminders: []
//   },
//   {
//     id: 3,
//     name: "Jonathan Chen",
//     email: "jonathan123@gmail.com",
//     password: "jonathan123!",
//     role: "user",
//     reminders: []
//   },
// ];

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
