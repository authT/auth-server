const jwt = require("jsonwebtoken");

const signToken = (data) => {
  return jwt.sign(data, process.env.PRIVATE_KEY);
};

exports.signToken = signToken;

exports.generateUserToken = (user) => {
  return signToken({
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    avatar: user.avatar,
  });
};
