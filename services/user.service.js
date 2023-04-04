const { User } = require("../models/mongo.model");

exports.findAndCreateUser = async (filter, data) => {
  let user = await User.findOne(filter);
  if (user) throw Error("User already exist");
  const newUser = new User(data);
  return await newUser.save();
};

exports.findAndUpdateUser = async (filter, data) => {
  return User.findOneAndUpdate(filter, data, { upsert: true, new: true });
};
