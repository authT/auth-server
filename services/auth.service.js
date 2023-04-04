const axios = require("axios");
const { User } = require("../models/mongo.model");
const { compare } = require("./bcrypt.service");
const { findAndUpdateUser } = require("./user.service");
const { generateUserToken } = require("./jwt.service");

const formatUrl = (rootUrl, options) => {
  const query = new URLSearchParams(options);
  return `${rootUrl}?${query.toString()}`;
};
exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw Error("User not found");
  if (password) {
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) throw Error("Wrong password");
  }
  return user;
};

// google oauth

exports.getGoogleConsentUrl = () => {
  return formatUrl("https://accounts.google.com/o/oauth2/v2/auth", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    access_type: "offline",
    prompt: "consent",
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  });
};

getGoogleAccessToken = async (code) => {
  const url = formatUrl("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });
  const response = await axios({
    method: "POST",
    url,
  });
  return response.data;
};

getGoogleUser = async (code) => {
  // get access_token from google
  const { id_token, access_token } = await getGoogleAccessToken(code);
  // get user data
  const url = formatUrl("https://www.googleapis.com/oauth2/v1/userinfo", {
    alt: "json",
    access_token,
  });
  const response = await axios({
    method: "GET",
    url,
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  return response.data;
};

exports.logWithGoogle = async (code) => {
  // get user data
  const { email, name, given_name, picture } = await getGoogleUser(code);
  const user = await findAndUpdateUser(
    { email },
    { email, fullname: name, username: given_name, avatar: picture }
  );
  // generate token for client
  return generateUserToken(user);
};

// github oauth

exports.getGithubConsentUrl = () => {
  return formatUrl("https://github.com/login/oauth/authorize", {
    client_id: process.env.GITHUG_CLIENT_ID,
  });
};

getGithubAccessToken = async (code) => {
  const url = formatUrl("https://github.com/login/oauth/access_token", {
    client_id: process.env.GITHUG_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  });
  const response = await axios({
    method: "POST",
    url,
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};

getGithubUser = async (code) => {
  // get token
  const { access_token } = await getGithubAccessToken(code);
  // get user data
  const response = await axios({
    method: "GET",
    url: "https://api.github.com/user",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

exports.logWithGithub = async (code) => {
  // get user data
  const { login, email, name, avatar_url } = await getGithubUser(code);
  // login
  const user = await findAndUpdateUser(
    { email },
    { username: login, email, fullname: name, avatar: avatar_url }
  );
  // generate token for client
  return generateUserToken(user);
};
