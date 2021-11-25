const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const jwtSecret = "jkjJ1235Ohno!";

/**
 * Authorize middleware to be used on the routes to be secured
 */

const authorize = (req, res, next) => {
  console.log("authorize() middleware");
  let token = req.get("authorization");
  if (!token) return res.status(401).send("You are not authenticated.");

  jwt.verify(token, jwtSecret, (err, token) => {
    if (err) return res.status(401).send(err.message);
    let user = User.getUserFromList(token.username);
    if (!user) return res.status(401).send("User not found.");
    // authorization is completed, call the next middleware
    next();
  });
};

const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in seconds : 24 * 60 * 60 * 1000 = 24h
/**
 * Example of how to use an asynchronous function which uses callback (sign() is asynchronous if a callback is supplied))
 * @param {*} param0
 * @param {*} callback
 */
const signAsynchronous = ({ username }, onSigningDoneCallback) => {
  const exp = Date.now() + LIFETIME_JWT;
  console.log("sign():", { username }, username, { ...username });
  jwt.sign(
    { username },
    jwtSecret,
    { expiresIn: LIFETIME_JWT },
    (err, token) => {
      return onSigningDoneCallback(err, token);
    }
  );
};

module.exports = { authorize, signAsynchronous };
