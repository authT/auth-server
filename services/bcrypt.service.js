const bcrypt = require("bcrypt");

exports.encrypt = async (data) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
};

exports.compare = async (client_secret, server_secret) => {
  return await bcrypt.compare(client_secret, server_secret);
};
