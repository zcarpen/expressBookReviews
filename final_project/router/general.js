const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const getBooks = () => {
        return new Promise((resolve) => {
          resolve(books);
        });
      };
  
      const booksList = await getBooks();
      res.status(200).json(booksList);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books" });
    }
  });
  
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          const book = Object.values(books).find(book => book.isbn === isbn);
          book ? resolve(book) : reject("Book not found");
        });
      };
  
      const book = await getBookByISBN(req.params.isbn);
      res.status(200).json(book);
    } catch (error) {
      res.status(404).json({ message: error });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
      const getBooksByAuthor = (author) => {
        return new Promise((resolve) => {
          const booksByAuthor = Object.values(books).filter(book => book.author === author);
          resolve(booksByAuthor);
        });
      };
  
      const booksList = await getBooksByAuthor(req.params.author);
      res.status(200).json(booksList);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books by author" });
    }
  });
  
  

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
      const getBooksByTitle = (title) => {
        return new Promise((resolve) => {
          const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
          resolve(booksByTitle);
        });
      };
  
      const title = req.params.title.replace(/-|_/g, ' ');
      const booksList = await getBooksByTitle(title);
      res.status(200).json(booksList);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving books by title" });
    }
  });
  
  

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book or reviews not found" });
    }
  });
  

module.exports.general = public_users;
