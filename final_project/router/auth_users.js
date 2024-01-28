const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const usersByUsername = users.filter((user) => {
        return user.username === username;
    });
    // No usernames returned means that username is valid for registration
    return usersByUsername.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const authenticatedUserList = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    // If the username and password match a user in our list, they are to be
    // authenticated
    return authenticatedUserList.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (authenticatedUser(username, password)) {
            const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
            req.session.authorization = {
                accessToken, username
            };
            return res.status(200).send({message: "user successfully logged in"});
        }
        return res.status(403).send({message: "invalid username and/or password"});
    }
    return res.status(403).send({message: "username and/or password missing"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.body.review;
    const book = books[isbn];
    if (book) {
        book.reviews[username] = review;
        return res.status(200).send({message: "review posted successfully"});
    }
    return res.status(404).send({message: `isbn ${isbn} not found`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const book = books[isbn];
    if (book) {
        delete book.reviews[username];
        return res.status(200).send({message: "review deleted successfully"});
    }
    return res.status(404).send({message: `isbn ${isbn} not found`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
