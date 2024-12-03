let { userModel } = require("../database");


// let authController = {
//   login: (req, res) => {
//     res.render("auth/login");
//   },

//   register: (req, res) => {
//     res.render("auth/register");
//   },

//   loginSubmit: (req, res) => {
//     res.send('Login successful')
//   },
// };

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};

const getUserById = async (id) => {
  let user = await userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password;
}

module.exports = {
  // authController,
  getUserByEmailIdAndPassword,
  getUserById,
};
