var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../models/User.js");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
  return res.json(User.list);
});

/* POST user data for authentication(LOGIN) */
router.post("/login", function (req, res, next) {
  let user = new User(req.body);
  user.checkCredentials(req.body.username, req.body.password).then((match) => {
    if (match) {
      jwt.sign(
        { username: user.username },
        jwtSecret,
        { expiresIn: LIFETIME_JWT },
        (err, token) => {
          if (err) {
            console.error("POST users/ :", err);
            return res.status(500).send(err.message);
          }
          console.log("POST users/ token:", token);
          return res.json({
            user: { username: user.username, admin: isAdmin(user.username) },
            token,
          });
        }
      );
    } else {
      console.log("POST users/login Error:", "Unauthentified");
      return res.status(401).send("bad email/password");
    }
  });
});

/* POST a new user (REGISTER) */
router.post("/", function (req, res, next) {
  if (User.isUser(req.body.username)) return res.status(409).end();
  let newUser = new User(req.body);
  newUser.save().then(() => {
    jwt.sign(
      { username: newUser.username },
      jwtSecret,
      { expiresIn: LIFETIME_JWT },
      (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST users/ token:", token);
        return res.json({
          user: { username: newUser.username, admin: false },
          token,
        });
      }
    );
  });
});

module.exports = router;
