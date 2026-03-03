const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");

const bcrypt = require('bcrypt');
const e = require("express");

async function main() {
const hash1=await bcrypt.hash("edit1", 10);
const hash2=await bcrypt.hash("edit2", 10);
const hash3=await bcrypt.hash("mem1", 10);
const hash4=await bcrypt.hash("mem2", 10);


db.serialize(function(){

  // Create an initial table of users
  db.run("DROP TABLE IF EXISTS Users");
  db.run("CREATE TABLE Users (username TEXT, password TEXT, level TEXT)");
  db.run("INSERT INTO Users VALUES (?,?,?)", ['mem1', hash3, 'member']);
  db.run("INSERT INTO Users VALUES (?,?,?)", ['mem2', hash4, 'member']);
  db.run("INSERT INTO Users VALUES (?,?,?)", ['edit1', hash1, 'editor']);
  db.run("INSERT INTO Users VALUES (?,?,?)", ['edit2', hash2, 'editor']);

  // create an initial table of articles
  db.run("DROP TABLE IF EXISTS Articles");
  db.run("CREATE TABLE Articles (title TEXT, username TEXT, content TEXT)");
  db.run("INSERT INTO Articles VALUES (?,?,?)",
          ["My favourite places to eat",
           "mem1",
            "<p>My favourite places to eat are The Keg, Boston Pizza and" +
            "   McDonalds</p><p>What are your favourite places to eat?</p>"]);
  db.run("INSERT INTO Articles VALUES (?,?,?)",
          ["Tips for NodeJS",
           "mem2",
            "<p>The trick to understanding NodeJS is figuring out how " +
            "async I/O works.</p> <p>Callback functions are also very " +
            "important!</p>"]);
  db.run("INSERT INTO Articles VALUES (?,?,?)",
          ["Ontario's top hotels",
           "edit1",
            "<p>The best hotel in Ontario is the Motel 8 on highway 234</p>" +
            "<p>The next best hotel is The Sheraton off main street.</p>"]);
});
db.close((err) => {
  if (err) 
    console.error(err.message);
  
  console.log('Closed the database connection.');
});
}
main().catch(console.error);