"strict mode";
const bcrypt = require("bcrypt");
const { FILE } = require("dns");
const saltRounds = 10;
const myPlaintextPassword = "145OkyayNo668Pass";
const FILE_PATH = __dirname + "/../data/users.json";

class User {
  constructor(data) {
    this.id = User.nextUserId();
    this.username = escape(data.username);
    this.email = escape(data.email);
    this.password = data.password;
    this.admin = false;
  }

  static nextUserId() {
    let userList = getUserListFromFile(FILE_PATH);
    if (userList.length === 0) return 1;
    return userList[userList.length - 1].id + 1;
  }

  /* return a promise with async / await */
  async save() {
    let userList = getUserListFromFile(FILE_PATH);
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    console.log("save:", this.email);
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

  /* return a promise with classic promise syntax*/
  checkCredentials(username, password) {
    if (!username || !password) return false;
    let userFound = User.getUserFromList(username);
    console.log("User::checkCredentials:", userFound, " password:", password);
    if (!userFound) return Promise.resolve(false);
    //try {
    console.log("checkCredentials:prior to await");
    // return the promise
    return bcrypt
      .compare(password, userFound.password)
      .then((match) => match)
      .catch((err) => err);
  }

  static get list() {
    let userList = getUserListFromFile(FILE_PATH);
    return userList;
  }

  static isUser(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isUser:", userFound);
    return userFound !== undefined;
  }

  static isAdmin(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isAdmin:", userFound);
    return userFound.admin;
  }

  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }

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

function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

module.exports = User;
