const axios = require("axios");
const { User } = require("../models/mongo.model");
const { compare } = require("./bcrypt.service");

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

//redirect to google login page
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

// get access token
const getGoogleAccessToken = async (code) => {
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

// get user detaild
exports.getGoogleUser = async (code) => {
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
  const { email, name, given_name, picture } = response.data;
  return { email, fullname: name, username: given_name, avatar: picture };
};

// github oauth

//redirect to github login page
exports.getGithubConsentUrl = () => {
  return formatUrl("https://github.com/login/oauth/authorize", {
    client_id: process.env.GITHUG_CLIENT_ID,
  });
};

// get access token
const getGithubAccessToken = async (code) => {
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

// get user detaild
exports.getGithubUser = async (code) => {
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
  const { login, email, name, avatar_url } = response.data;
  return { username: login, email, fullname: name, avatar: avatar_url };
};
