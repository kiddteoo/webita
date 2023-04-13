const express = require('express');
const path = require('path')
const session = require('express-session');

const cors = require("cors");
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.static('.'));

app.use(cookieParser());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
console.log("Before")
app.use(
    session({
      secret: 'paco124',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );




/* app.get('/signin', (req, res) => {
    console.log("Hola")

    if (req.cookies.username) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname + '/signin/index.html'));
    }
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/signup/index.html'));
});
 */
const PORT = 4000;


app.listen(PORT, () => {
    console.log("Listening...")
})

app.get('/sign', (req, res) => {
    if (req.cookies.username)
        res.redirect('/public');
    else
        res.sendFile(__dirname + '/signin/index.html');
});

app.get('/public', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/login', (req, res) => {
    console.log(req.body.values[0]);
    res.json({ redirectUrl: '/public' });
});



app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup/index.html');
});