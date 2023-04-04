const { string, object } = require("yup");

exports.authInput = object({
  email: string().required(),
  password: string().min(4).max(8),
});

exports.newUserInput = object({
  username: string().required(),
  password: string().min(4).max(8),
  email: string().email().required(),
  fullname: string().required(),
});
