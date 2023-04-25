const express = require('express');
const path = require('path')
const session = require('express-session');
const database = require('./database/connection');
const readDB = require('./database/read')
const insertDB = require('./database/create')
const updateDB = require('./database/update')
const deleteDB = require('./database/delete')
const cors = require("cors");
const CryptoJS = require('crypto-js');

const cookieParser = require('cookie-parser');
const { stat } = require('fs');


const app = express();
app.use(express.static('.'));

// Serve static files from the 'webita/client' folder
app.use(cookieParser());
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    next();
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

const PORT = 4000;


app.listen(PORT, () => {
    console.log("Listening...")
})

app.get('/sign', (req, res) => {
    ses = req.session;
    console.log(ses)
    if(ses.user)
        res.redirect('/app')
    else
        res.sendFile(__dirname + '/signin/index.html');
});

var ses;

app.get('/', (req, res) => {
    ses = req.session;
    console.log(ses)
    if(ses.user)
        res.redirect('/app')
    else
        res.redirect('/public');

});

app.get('/public', (req, res) => {
    res.sendFile(__dirname + '/info/index.html');
});
app.get('/app', (req, res) => {
    ses = req.session;
    console.log(ses)
    if(ses.user) 
        res.sendFile(__dirname + '/app2/index.html');
    else
        res.redirect('/public'); 
});

app.get('/app/profile', function(req, res){
    if(req.session.perfil)
        res.sendFile(__dirname + '/profile/index.html');
    else
        res.redirect('/app')
});
app.post('/getProf', function(req, res){
    res.json(req.session.perfil);
});

app.get('/app/profile/:id', function(req, res){
    var profileId = req.params.id;
    readDB.getUser(profileId, function(status){
        status.password = 'null';
        req.session.perfil = status;
        res.redirect('/app/profile')
    })
});


app.get('/app/myprofile', function(req, res){
    if(req.session.user)
        res.sendFile(__dirname + '/myprofile/index.html');
    else
        res.redirect('/sign')})

app.post('/getMyProfil', function(req, res){
    readDB.getUser(req.session.user, function(status){
        status.password = 'null';
        req.session.perfil = status;
        res.json(status);
    })
});




app.post('/google', (req, res) => {
    var name = req.body.values[0];
    var surname = req.body.values[1];
    var username = req.body.values[2];
    var new_user = username.split('@');
    username = new_user[0];
    var email = req.body.values[3];
    var pass = req.body.values[4];
    var img = req.body.values[5];

    const usuari = {
        username: username,
        password: pass,
        url_img: img,
        nombre: name,
        apellidos: surname,
        fecha_nac: '28/08/2003'
    }

    readDB.getUser(username, function(status){
        if (status == null){
            insertDB.insertUsuari(usuari, function (status) {
                /*         if(status == true)
                            res.json({ redirectUrl: '/public' }); */
                    })
                    ses = req.session;
                    ses.user = username;
                    res.json({ redirectUrl: '/app' });

        }
        else{
            ses = req.session;
            ses.user = username;
            res.json({ redirectUrl: '/app' });
        }
    });

 });

 app.post('/createNew', (req, res) => {
    var name = req.body.values[0];
    var surname = req.body.values[1];
    var username = req.body.values[2];
    var email = req.body.values[3];
    var pass = req.body.values[4];

    const usuari = {
        username: username,
        password: CryptoJS.SHA256(pass).toString(),
        url_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAJFBMVEX////d3d3c3Nz4+Pjm5ub7+/vh4eHq6ur19fXy8vLu7u7Z2dk19XF3AAAEzUlEQVRogcVb2QKkIAxbuY///98Fj/GEphV38zijRmhpG6h//ghgQ0zemwXepxis5DFc6OideoLzUX/Ia6OZJqWmZ9Q/TPxkAmxybd4Dv0uj6YNRJPFGr0wYyJxcxohX+uzSKGYW8UY/gj1NfOaZfXrLHp2MeWZ38QWzfcG8sIt9PoKu3SFXsqFbl18yV2TJ0N8PeoFg6H7EoBdkz6M2Ywa9QBkG81v/vpHjRh9NzSC3wkjWJZ8gcjueeWYHyO0nzBUk+Xhbb6Bt/hl1Je9TD13XN/LuOk9fUhfyTkoP31IX8nYl9zV1If8vxl65GyaP41JXG/kxo34Uz654jG//YMZn7odZZ/p4lX+5AJUrhzvvvs4JaEV1uqp8tQ7RG0CnnW6+hbcI317lrj4ZrepTzptf3Q1nflR6liUizveiwTSbpsCP8NgvoRXUt1NX3SY0QJyiG2ZtRRW7Gpz4k8Whe5AiHwsSR1fX0GRBuwkeIs+adYMCd5Eg8oP1HOtNCUDT/pv0QE85R9AhzpM3A9JvSnr4EUiVvWUUS085UWFegKzYtWCmM1inzHoEYPL1kaRnsjRshQa4l7hKTnlmb1sAC202I+ka7GFj9VcdEGlufGnvAJZONTidPvnUiP8m4BV7QqYNmrtaknI17gJbQE+6A96wKWO6oC2pAJfkxbQNdFouIoHyClYoP4DOT5oMvjJXAwrfkhpJbuHhBxktCzflFGJu0ofTZ9zkIvvP3FTK+Y7b09zCAxfa1wBu4RpDakDS3vzsPYOOa7SvCWMqlETJohLZfL6DrpqAuCZ0NrruLs8lJ0dkcAtInQDUs1nADexjFHFJl5SSSQfUZfUj+iq+pwPqci5B6Vd83gPtDhtRZH9wDcEAIgbnegi4kBtXaebVizRyIUuaYHsu8yMRn+TMOrYPvzwR2SBhkANhZfpFLOg94VIZPAJY1w6g1HFyDe6qbh4EGBwlR3c1f8sW80vkEBtukvgNBNvSJLeROU0S+34CvO+eTWfo+Ab6cdngx6BK+QY76+DgGCgZp3JqMvfuRJsc67zmWBKwzsaUcibupzU21I4+xv2XUgj1tp0+T87VLk3nVGYfkZ13riTH/Ut/Jv++a4D+/OT7xH1Zqh/2Odyor3mJCuoKNCtw3b0Y6Lh67Tr1KWgMIfnuCelDXmjmvnoKyZVFtvaztp738LDnU70sbniMz31/z82jD+6W3ZsW2/DA3iiAbu6mpLr/h3Sb+VbVeUkpyr1v6r7WEu3RnC6UbjhccFo/vZKT9AkBTj7cuW43OV+DNbHXwX2JsQmkgdQ7OSWmF3977eCyh9aidZCb7agOh9TY5TrZtlYPDhxPWWkjrV0RYUFnxnTs70gZt6JX3P7l/uMy59ClxOGeCmDBGmZeKMLqVQrbERy7A11XCTKA2pdMxk9JZarknyqssGXQolhR5v2lyxUnkx472Popj3ypx/pxj3zm4iT2uepj72KU9TL2mbkll2Ho4nPc76Lqd1eq3WXHYq/dmPCj6suqTn8fF2nKRet4eu5DCcdFH49NB9GoefSpqVFsSPOIlRmdBddO0Cq4nUlRa7u9g7VVg81dquXPj75WrEOrMi/XwU1ux+8n//F3onbVmSfMOvWffJ86v4IOcUHQUtK/HYswl1HlW4MAAAAASUVORK5CYII=',
        nombre: name,
        apellidos: surname,
        fecha_nac: '28/08/2003'
    }
    console.log(usuari);
    insertDB.insertUsuari(usuari, function (status) {
        if(status == true)
            res.json({ redirectUrl: '/app' });
    })
 });

 app.post('/verifyLogin', (req, res) => {
    var user = req.body.values[0];
    var pass = req.body.values[1];
    
    console.log(user)
    console.log(pass)
    readDB.getUser(user, function(status){
        if (status == null)
            console.log("NULL");
        else{
            console.log(CryptoJS.SHA256(pass).toString())
            if(CryptoJS.SHA256(pass).toString() == status.password){
                ses = req.session;
                ses.user = user;
                
                res.json({ redirectUrl: '/app' });
            }
        }
    });
 });



app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/signup/index.html');
});

app.post('/getPublicacions', (req, res) =>{
    readDB.getPosts(function(status){
        res.json(status);
    })
})
app.post('/getProfiles', (req, res) => {
    readDB.getUsers(function(status){
        res.json(status);
    })
})


app.post('/addNewPost', (req, res) => {
    let fecha = new Date();
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    if (hora < 10) {
        hora = '0' + hora;
    }
    if (minutos < 10) {
        minutos = '0' + minutos;
    }
    if (segundos < 10) {
        segundos = '0' + segundos;
    }
    let tiempoActual = hora + ':' + minutos + ':' + segundos

    //Llamnar a las imagenes de los posts -> user + hora.png EX: A19Narcis_091232.png
    const post = {
        tipus: 'doubt',
        titol: 'How to substract numeric and alphanumeric value in python?',
        text: 'I have 2 column with numeric and alphanumeric value. I want to apply substraction on numeric value in third column and keep aplhanumeric value as "Canadian". Please help',
        url_img: '',
        url_video: '',
        likes: 0,
        comentaris: [],
        owner: 'teo.merienda'
        
    }
    /*const post = {
        tipus: 'image',
        titol: '',
        text: 'Mi primer post en esta red social.',
        url_img: 'http://localhost:3000/uploads/images/JavaScript_code.png', 
        url_video: '',
        comentaris: [],
        owner: 'TeoX',
        user_img: 'http://localhost:3000/uploads/user_img/TeoX.png',
        hora: tiempoActual
    }*/

    insertDB.insertPost(post, function () {
        res.send({ success: true });
    })
})


app.post('/deletePost', (req, res) => {
    const _id = '643e6f316ac36d92585dea10';
    const username = 'teo.merienda'
    deleteDB.deletePost(_id, username, () => {
        res.send({ removed: true })
    })
})

