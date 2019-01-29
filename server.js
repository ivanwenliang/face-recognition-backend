const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'IvanLiang',
        password: '',
        database: 'smart-brain'
    }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('It is working');
})

// Check user credentials and route to home page
app.post('/signIn', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) })

// Create new user
// Dependency injection
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// Update number of images submitted by each user
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// Check server is running
app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})