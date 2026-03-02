const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function dbconn() {
  try {
    db = await sqlite.open({
      filename: 'database.db',
      driver: sqlite3.Database
    });
  } catch(err) {
      console.error(err);
  }
}


async function findUser(username, password) {
  let result = await db.get("SELECT * FROM Users WHERE username=? AND password=?",
                            [username, password]);
  return result;
}


async function addUser(username, password) {
    let result =await db.run("INSERT INTO Users (username, password, level) VALUES (?, ?, ?)",
                            [username, password, "member"]);
    return result;
}


module.exports = {findUser, addUser, dbconn};