const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).send({message: "User successfully registered"});
        }
        return res.status(400).send({message: `Username '${username}' already registered`});
    }
    return res.status(400).send({message: "Unable to register user. Missing username and/or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({"books": books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    for (const key in books) {
        if(books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    }    
    res.send({"books": booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    for (const key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    }
    res.send({"books": booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send({"reviews": books[isbn].reviews});
});

module.exports.general = public_users;
