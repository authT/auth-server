const jwt = require("jsonwebtoken");

exports.signToken = (data) => {
  return jwt.sign(data, process.env.PRIVATE_KEY);
};

exports.generateUserToken = (user) => {
  return this.signToken({
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    avatar: user.avatar,
  });
};
