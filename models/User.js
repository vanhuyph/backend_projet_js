"strict mode";
const bcrypt = require("bcrypt");
const { FILE } = require("dns");
const saltRounds = 10;
const FILE_PATH = __dirname + "/../data/users.json";

class User {
  constructor(data) {
    this.id = User.nextUserId();
    this.username = escape(data.username);
    this.email = escape(data.email);
    this.password = data.password;
    this.admin = false;
  }

  /* Return the next user id */
  static nextUserId() {
    let userList = getUserListFromFile(FILE_PATH);
    if (userList.length === 0) return 1;
    return userList[userList.length - 1].id + 1;
  }

  /* Save a new user */
  async save() {
    let userList = getUserListFromFile(FILE_PATH);
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    userList.push({
      id: this.id,
      username: this.username,
      email: this.email,
      password: hashedPassword,
      admin: this.admin,
    });
    saveUserListToFile(FILE_PATH, userList);
    return true;
  }

  /* Check the username, password and return a promise */
  checkCredentials(username, password) {
    if (!username || !password) return false;
    let userFound = User.getUserFromList(username);
    console.log("User::checkCredentials:", userFound, " password:", password);
    if (!userFound) return Promise.resolve(false);
    // return the promise
    return bcrypt
      .compare(password, userFound.password)
      .then((match) => match)
      .catch((err) => err);
  }

  /* Return a list of users from a file */
  static get list() {
    let userList = getUserListFromFile(FILE_PATH);
    return userList;
  }

  /* Check if the user exist based on their username and return the user or undefined */
  static isUser(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isUser:", userFound);
    return userFound !== undefined;
  }

  /* Check if the user is an admin. Return true if it's the case or else false. */
  static isAdmin(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isAdmin:", userFound);
    return userFound.admin;
  }

  /* Return an user based on their username */
  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }

  /* Delete an user based on their id. Return the deleted user. */
  static delete(id) {
    let usersList = getUserListFromFile(FILE_PATH);
    const index = usersList.findIndex((user) => user.id == id);
    if (index < 0) return;
    const itemRemoved = { ...usersList[index] };
    // remove the user found at index
    usersList.splice(index, 1);
    saveUserListToFile(FILE_PATH, usersList);
    return itemRemoved;
  }

  /* Update an user and return the updated user. */
  static update(id, newData) {
    let userList = getUserListFromFile(FILE_PATH);
    let index = userList.findIndex((user) => user.id == id);
    if (index < 0 || !newData) return;

    //escape new data to protect against XXS attack
    if (newData.username) newData.username = escape(newData.username);
    if (newData.email) newData.email = escape(newData.email);

    userList[index] = { ...userList[index], ...newData };
    const userUpdated = { ...userList[index] };
    saveUserListToFile(FILE_PATH, userList);
    return userUpdated;
  }
}

/* Return a list of users from a file. */
function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

/* Save an user to a file. */
function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

module.exports = User;
