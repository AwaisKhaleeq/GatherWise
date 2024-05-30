require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the same directory as server.js
app.use(express.static(__dirname));

// API route for user registration
app.post('/register', (req, res) => {
    const { name, email, username, password, role } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        
        const sql = 'INSERT INTO Users (Name, Email, Username, Password, Role) VALUES (?, ?, ?, ?, ?)';
        const values = [name, email, username, password, role];

        connection.query(sql, values, (err, results) => {
            connection.release();  // return the connection to the pool
            if (err) {
                console.error(err);
                res.status(500).send('Server error');
            } else {
                // Redirect to login.html on successful registration
                res.redirect('/login.html');
            }
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const sql = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
        const values = [username, password];

        connection.query(sql, values, (err, results) => {
            connection.release();  // return the connection to the pool
            if (err) {
                console.error(err);
                res.status(500).send('Server error');
            } else {
                if (results.length > 0) {
                    // If user is found, redirect to home.html
                    res.redirect('/home.html');
                } else {
                    // If user not found, redirect back to login.html with an error
                    res.send('Username or password is incorrect');
                }
            }
        });
    });
});

app.post('/registerPerformance', (req, res) => {
    const { name, roll, batch, performance } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database connection error');
            return;
        }
        
        const sql = 'INSERT INTO Performance_Registration (Name, RollNumber, Batch, PerformancePreference) VALUES (?, ?, ?, ?)';
        const values = [name, roll, batch, performance];

        connection.query(sql, values, (err, results) => {
            connection.release(); // Always release the connection back
            if (err) {
                console.error(err);
                res.status(500).send('Failed to register performance');
            } else {
                // Redirect back to the performance registration page
                res.redirect('/performance.html');
            }
        });
    });
});

// Assuming previous middleware and database setup

// Route to handle menu suggestions
app.post('/menuSuggestions', (req, res) => {
    const { name, roll, batch, meat, salad, drink, sweets } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database connection error');
            return;
        }

        const sql = 'INSERT INTO Menu_Suggestions (Name, RollNumber, Batch, Meat, Salad, Drink, TraditionalSweets) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [name, roll, batch, meat, salad, drink, sweets];

        connection.query(sql, values, (err, results) => {
            connection.release(); // always release connection back to the pool
            if (err) {
                console.error(err);
                res.status(500).send('Failed to submit menu suggestions');
            } else {
                // Redirect back to the menu suggestions page
                res.redirect('/menu.html');
            }
        });
    });
});

// Assuming previous middleware and database setup

// Route to handle task applications
app.post('/registerTask', (req, res) => {
    const { team, message } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database connection error');
            return;
        }

        const sql = 'INSERT INTO Task_Application (Team, AdditionalMessage) VALUES (?, ?)';
        const values = [team, message];

        connection.query(sql, values, (err, results) => {
            connection.release(); // always release connection back to the pool
            if (err) {
                console.error(err);
                res.status(500).send('Failed to submit task application');
            } else {
                // Redirect back to the task application page
                res.redirect('/tasks.html');
            }
        });
    });
});

app.post('/registerFarewell', (req, res) => {
    const { name, rollNumber, theme, familyMembers, menuSelection, performancePreference } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database connection error');
            return;
        }

        const sql = 'INSERT INTO Farewell_Registration (Name, RollNumber, FamilyMembers, Theme, MenuSelection, PerformancePreference) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [name, rollNumber, familyMembers, theme, menuSelection, performancePreference];

        connection.query(sql, values, (err, results) => {
            connection.release(); // always release connection back to the pool
            if (err) {
                console.error(err);
                res.status(500).send('Failed to register for farewell');
            } else {
                // Redirect or send a successful registration message
                res.redirect('/farewell_registration.html');
            }
        });
    });
});

// Start server
app.listen(port, () => {
    console.log("Server running on port " + port);
});