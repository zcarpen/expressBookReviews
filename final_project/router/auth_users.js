const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = 'thisIsMySuperSecretKey';

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
  };
  
  const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
  };
  
  // Only registered users can login
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!isValid(username)) {
      return res.status(404).json({ message: "Username not found" });
    }
  
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      req.session.authorization = { accessToken: token };
      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;

    console.log('anything')
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
