const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User registered successfully"
    });
});

// Internal route used by Axios to retrieve all books
public_users.get('/books', function (req, res) {
    return res.status(200).json(books);
});

// Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books');

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.setHeader('Content-Type', 'application/json');

    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    }

    return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const result = {};

    bookKeys.forEach((key) => {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    });

    res.setHeader('Content-Type', 'application/json');

    if (Object.keys(result).length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }

    return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const result = {};

    bookKeys.forEach((key) => {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    });

    res.setHeader('Content-Type', 'application/json');

    if (Object.keys(result).length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }

    return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    res.setHeader('Content-Type', 'application/json');

    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
