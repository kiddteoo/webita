const express = require('express');
const path = require('path')
const session = require('express-session');
const fs = require('fs');
const database = require('./database/connection');
const readDB = require('./database/read')
const insertDB = require('./database/create')
const updateDB = require('./database/update')
const deleteDB = require('./database/delete')
const cors = require("cors");
const CryptoJS = require('crypto-js');
const multer = require('multer');
const nodemailer = require('nodemailer');


const upload = multer({ dest: 'uploads/' });


const cookieParser = require('cookie-parser');
const { stat } = require('fs');
const { exit } = require('process');


const app = express();
app.use(express.static('.'));

// Serve static files from the 'webita/client' folder
app.use(cookieParser());
app.use('/uploads', express.static('client/uploads'))
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
    if (ses.user)
        res.redirect('/app')
    else
        res.sendFile(__dirname + '/signin/index.html');
});

var ses;

app.get('/', (req, res) => {
    ses = req.session;
    console.log(ses)
    if (ses.user)
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
    if (ses.user)
        res.sendFile(__dirname + '/app2/index.html');
    else
        res.redirect('/sign');
});

app.get('/app/profile', function (req, res) {
    console.log("hola")
    if (req.session.perfil)
        res.sendFile(__dirname + '/profile/index.html');
    else
        res.redirect('/app')
});

app.post('/getProf', function (req, res) {
    console.log("ATENTO" + req.session.perfil.nombre)
    res.json(req.session.perfil);
});

app.post('/getProf2', function (req, res) {
    var profileId = req.body.values[0];
    req.session.perfil = null
    readDB.getUser(profileId, function (status) {
            status.password = 'null';
            req.session.perfil = status;
            res.json(status)
        })
});




app.get('/app/myprofile', function (req, res) {
    if (req.session.user)
        res.sendFile(__dirname + '/myprofile/index.html');
    else
        res.redirect('/sign')
})


app.get('/app/profile/:id', function (req, res) {
    var profileId = req.params.id;
    if(profileId == req.session.user)
        res.redirect('/app/myprofile')
    else{
        readDB.getUser(profileId, function (status) {
            status.password = 'null';
            req.session.perfil = status;
            res.redirect('/app/profile')
        })
    }

});

app.post('/getMyProfil', function (req, res) {
    readDB.getUserByEmail(req.session.email, function (status) {
        console.log(req.session.email);
        console.log(status)
        if (status != null) { 
            res.json(status);
        }
        else{
            res.json(null);
        }
    })
});

app.post('/addLike', function (req, res) {
    const id_publi = req.body.values[0];
    const id_user = req.body.values[1];
    updateDB.addLikePost(id_publi, id_user, () => {
        res.send({ success: true }) 
    })
});

app.post('/removeLike', function (req, res) {
    const id_publi = req.body.values[0];
    const id_user = req.body.values[1];
    updateDB.removeLikePost(id_publi, id_user, () => {
        res.send({ success: true })
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
        email: email,
        username: username,
        password: pass,
        url_img: img,
        nombre: name,
        apellidos: surname,
        fecha_nac: '28/08/2003'
    }

    readDB.getUserByEmail(email, function (status) {
        console.log(status)
        if (status == null) {

            insertDB.insertUsuari(usuari, function (status) {
                /*         if(status == true)
                            res.json({ redirectUrl: '/public' }); */
            })
            ses = req.session;
            ses.user = username;
            ses.email = email;
            res.json({ redirectUrl: '/app' });

        }
        else {
            console.log("hoa")
            ses = req.session;
            ses.user = username;
            ses.email = email;
            res.json({ redirectUrl: '/app' });
        }
    });

});


app.post('/sendCode',  (req, res) =>{
    var name = req.body.values[0];
    var surname = req.body.values[1];
    var username = req.body.values[2];
    var email = req.body.values[3];
    console.log(email)
    var pass = req.body.values[4];
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tenarse.oficial@gmail.com',
            pass: 'omojnarpxrbnwjlr'
        }
    });

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
    const code = getRandomInt(99999);
    let mailOptions = {
        from: 'tenarse.oficial@gmail.com', 
        to: email, 
        subject: 'Verification Code',
        html: "<p>Your verification code: </p><p style='color: blue;'>" + code + "</p>"
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        
      
    });

    req.session.code = code;
    res.json('success')



    //CREAR FUNCION VERIFY CODE... Y SI LO PONE BIEN ENVIAS CODIGO
/*     var name = req.body.values[0];
    var surname = req.body.values[1];
    var username = req.body.values[2];
    var email = req.body.values[3];
    var pass = req.body.values[4];
    console.log("EMAIL", email)
    const usuari = {
        email: email,
        username: username,
        password: CryptoJS.SHA256(pass).toString(),
        url_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAJFBMVEX////d3d3c3Nz4+Pjm5ub7+/vh4eHq6ur19fXy8vLu7u7Z2dk19XF3AAAEzUlEQVRogcVb2QKkIAxbuY///98Fj/GEphV38zijRmhpG6h//ghgQ0zemwXepxis5DFc6OideoLzUX/Ia6OZJqWmZ9Q/TPxkAmxybd4Dv0uj6YNRJPFGr0wYyJxcxohX+uzSKGYW8UY/gj1NfOaZfXrLHp2MeWZ38QWzfcG8sIt9PoKu3SFXsqFbl18yV2TJ0N8PeoFg6H7EoBdkz6M2Ywa9QBkG81v/vpHjRh9NzSC3wkjWJZ8gcjueeWYHyO0nzBUk+Xhbb6Bt/hl1Je9TD13XN/LuOk9fUhfyTkoP31IX8nYl9zV1If8vxl65GyaP41JXG/kxo34Uz654jG//YMZn7odZZ/p4lX+5AJUrhzvvvs4JaEV1uqp8tQ7RG0CnnW6+hbcI317lrj4ZrepTzptf3Q1nflR6liUizveiwTSbpsCP8NgvoRXUt1NX3SY0QJyiG2ZtRRW7Gpz4k8Whe5AiHwsSR1fX0GRBuwkeIs+adYMCd5Eg8oP1HOtNCUDT/pv0QE85R9AhzpM3A9JvSnr4EUiVvWUUS085UWFegKzYtWCmM1inzHoEYPL1kaRnsjRshQa4l7hKTnlmb1sAC202I+ka7GFj9VcdEGlufGnvAJZONTidPvnUiP8m4BV7QqYNmrtaknI17gJbQE+6A96wKWO6oC2pAJfkxbQNdFouIoHyClYoP4DOT5oMvjJXAwrfkhpJbuHhBxktCzflFGJu0ofTZ9zkIvvP3FTK+Y7b09zCAxfa1wBu4RpDakDS3vzsPYOOa7SvCWMqlETJohLZfL6DrpqAuCZ0NrruLs8lJ0dkcAtInQDUs1nADexjFHFJl5SSSQfUZfUj+iq+pwPqci5B6Vd83gPtDhtRZH9wDcEAIgbnegi4kBtXaebVizRyIUuaYHsu8yMRn+TMOrYPvzwR2SBhkANhZfpFLOg94VIZPAJY1w6g1HFyDe6qbh4EGBwlR3c1f8sW80vkEBtukvgNBNvSJLeROU0S+34CvO+eTWfo+Ab6cdngx6BK+QY76+DgGCgZp3JqMvfuRJsc67zmWBKwzsaUcibupzU21I4+xv2XUgj1tp0+T87VLk3nVGYfkZ13riTH/Ut/Jv++a4D+/OT7xH1Zqh/2Odyor3mJCuoKNCtw3b0Y6Lh67Tr1KWgMIfnuCelDXmjmvnoKyZVFtvaztp738LDnU70sbniMz31/z82jD+6W3ZsW2/DA3iiAbu6mpLr/h3Sb+VbVeUkpyr1v6r7WEu3RnC6UbjhccFo/vZKT9AkBTj7cuW43OV+DNbHXwX2JsQmkgdQ7OSWmF3977eCyh9aidZCb7agOh9TY5TrZtlYPDhxPWWkjrV0RYUFnxnTs70gZt6JX3P7l/uMy59ClxOGeCmDBGmZeKMLqVQrbERy7A11XCTKA2pdMxk9JZarknyqssGXQolhR5v2lyxUnkx472Popj3ypx/pxj3zm4iT2uepj72KU9TL2mbkll2Ho4nPc76Lqd1eq3WXHYq/dmPCj6suqTn8fF2nKRet4eu5DCcdFH49NB9GoefSpqVFsSPOIlRmdBddO0Cq4nUlRa7u9g7VVg81dquXPj75WrEOrMi/XwU1ux+8n//F3onbVmSfMOvWffJ86v4IOcUHQUtK/HYswl1HlW4MAAAAASUVORK5CYII=',
        nombre: name,
        apellidos: surname,
        fecha_nac: '28/08/2003'
    }
    readDB.getUserByEmail(email, function (status) {
        console.log(status);
        if (status == null) {
          insertDB.insertUsuari(usuari, function (status) {
            /* if(status == true)
                 res.json({ redirectUrl: '/public' }); 
          });
          const ses = req.session;
          ses.user = username;
          ses.email = email;
          res.json({ redirectUrl: '/app' });
        }
      }); */
})

app.post('/verifyCode', (req, res ) =>{
    var name = req.body.values[0];
    var surname = req.body.values[1];
    var username = req.body.values[2];
    var email = req.body.values[3];
    var pass = req.body.values[4];
    var code = req.body.values[5];
    console.log(code);
    console.log("EMAIL", email)
    
    const usuari = {
        email: email,
        username: username,
        password: CryptoJS.SHA256(pass).toString(),
        url_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAJFBMVEX////d3d3c3Nz4+Pjm5ub7+/vh4eHq6ur19fXy8vLu7u7Z2dk19XF3AAAEzUlEQVRogcVb2QKkIAxbuY///98Fj/GEphV38zijRmhpG6h//ghgQ0zemwXepxis5DFc6OideoLzUX/Ia6OZJqWmZ9Q/TPxkAmxybd4Dv0uj6YNRJPFGr0wYyJxcxohX+uzSKGYW8UY/gj1NfOaZfXrLHp2MeWZ38QWzfcG8sIt9PoKu3SFXsqFbl18yV2TJ0N8PeoFg6H7EoBdkz6M2Ywa9QBkG81v/vpHjRh9NzSC3wkjWJZ8gcjueeWYHyO0nzBUk+Xhbb6Bt/hl1Je9TD13XN/LuOk9fUhfyTkoP31IX8nYl9zV1If8vxl65GyaP41JXG/kxo34Uz654jG//YMZn7odZZ/p4lX+5AJUrhzvvvs4JaEV1uqp8tQ7RG0CnnW6+hbcI317lrj4ZrepTzptf3Q1nflR6liUizveiwTSbpsCP8NgvoRXUt1NX3SY0QJyiG2ZtRRW7Gpz4k8Whe5AiHwsSR1fX0GRBuwkeIs+adYMCd5Eg8oP1HOtNCUDT/pv0QE85R9AhzpM3A9JvSnr4EUiVvWUUS085UWFegKzYtWCmM1inzHoEYPL1kaRnsjRshQa4l7hKTnlmb1sAC202I+ka7GFj9VcdEGlufGnvAJZONTidPvnUiP8m4BV7QqYNmrtaknI17gJbQE+6A96wKWO6oC2pAJfkxbQNdFouIoHyClYoP4DOT5oMvjJXAwrfkhpJbuHhBxktCzflFGJu0ofTZ9zkIvvP3FTK+Y7b09zCAxfa1wBu4RpDakDS3vzsPYOOa7SvCWMqlETJohLZfL6DrpqAuCZ0NrruLs8lJ0dkcAtInQDUs1nADexjFHFJl5SSSQfUZfUj+iq+pwPqci5B6Vd83gPtDhtRZH9wDcEAIgbnegi4kBtXaebVizRyIUuaYHsu8yMRn+TMOrYPvzwR2SBhkANhZfpFLOg94VIZPAJY1w6g1HFyDe6qbh4EGBwlR3c1f8sW80vkEBtukvgNBNvSJLeROU0S+34CvO+eTWfo+Ab6cdngx6BK+QY76+DgGCgZp3JqMvfuRJsc67zmWBKwzsaUcibupzU21I4+xv2XUgj1tp0+T87VLk3nVGYfkZ13riTH/Ut/Jv++a4D+/OT7xH1Zqh/2Odyor3mJCuoKNCtw3b0Y6Lh67Tr1KWgMIfnuCelDXmjmvnoKyZVFtvaztp738LDnU70sbniMz31/z82jD+6W3ZsW2/DA3iiAbu6mpLr/h3Sb+VbVeUkpyr1v6r7WEu3RnC6UbjhccFo/vZKT9AkBTj7cuW43OV+DNbHXwX2JsQmkgdQ7OSWmF3977eCyh9aidZCb7agOh9TY5TrZtlYPDhxPWWkjrV0RYUFnxnTs70gZt6JX3P7l/uMy59ClxOGeCmDBGmZeKMLqVQrbERy7A11XCTKA2pdMxk9JZarknyqssGXQolhR5v2lyxUnkx472Popj3ypx/pxj3zm4iT2uepj72KU9TL2mbkll2Ho4nPc76Lqd1eq3WXHYq/dmPCj6suqTn8fF2nKRet4eu5DCcdFH49NB9GoefSpqVFsSPOIlRmdBddO0Cq4nUlRa7u9g7VVg81dquXPj75WrEOrMi/XwU1ux+8n//F3onbVmSfMOvWffJ86v4IOcUHQUtK/HYswl1HlW4MAAAAASUVORK5CYII=',
        nombre: name,
        apellidos: surname,
        fecha_nac: '28/08/2003'
    }
    if(req.session.code == code)
    {
        readDB.getUserByEmail(email, function (status) {
            console.log(status);
            if (status == null) {
              insertDB.insertUsuari(usuari, function (status) {
                /* if(status == true)
                     res.json({ redirectUrl: '/public' }); */
              });
              const ses = req.session;
              ses.user = username;
              ses.email = email;
              res.json({ redirectUrl: '/app' });
            }
          });
    }
})

app.post('/createNew',   (req, res) => {
    var name = req.body.values[0];
    var surname = req.body.values[1];
    var username = req.body.values[2];
    var email = req.body.values[3];
    var pass = req.body.values[4];

    const usuari = {
        email: email,
        username: username,
        password: CryptoJS.SHA256(pass).toString(),
        url_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAJFBMVEX////d3d3c3Nz4+Pjm5ub7+/vh4eHq6ur19fXy8vLu7u7Z2dk19XF3AAAEzUlEQVRogcVb2QKkIAxbuY///98Fj/GEphV38zijRmhpG6h//ghgQ0zemwXepxis5DFc6OideoLzUX/Ia6OZJqWmZ9Q/TPxkAmxybd4Dv0uj6YNRJPFGr0wYyJxcxohX+uzSKGYW8UY/gj1NfOaZfXrLHp2MeWZ38QWzfcG8sIt9PoKu3SFXsqFbl18yV2TJ0N8PeoFg6H7EoBdkz6M2Ywa9QBkG81v/vpHjRh9NzSC3wkjWJZ8gcjueeWYHyO0nzBUk+Xhbb6Bt/hl1Je9TD13XN/LuOk9fUhfyTkoP31IX8nYl9zV1If8vxl65GyaP41JXG/kxo34Uz654jG//YMZn7odZZ/p4lX+5AJUrhzvvvs4JaEV1uqp8tQ7RG0CnnW6+hbcI317lrj4ZrepTzptf3Q1nflR6liUizveiwTSbpsCP8NgvoRXUt1NX3SY0QJyiG2ZtRRW7Gpz4k8Whe5AiHwsSR1fX0GRBuwkeIs+adYMCd5Eg8oP1HOtNCUDT/pv0QE85R9AhzpM3A9JvSnr4EUiVvWUUS085UWFegKzYtWCmM1inzHoEYPL1kaRnsjRshQa4l7hKTnlmb1sAC202I+ka7GFj9VcdEGlufGnvAJZONTidPvnUiP8m4BV7QqYNmrtaknI17gJbQE+6A96wKWO6oC2pAJfkxbQNdFouIoHyClYoP4DOT5oMvjJXAwrfkhpJbuHhBxktCzflFGJu0ofTZ9zkIvvP3FTK+Y7b09zCAxfa1wBu4RpDakDS3vzsPYOOa7SvCWMqlETJohLZfL6DrpqAuCZ0NrruLs8lJ0dkcAtInQDUs1nADexjFHFJl5SSSQfUZfUj+iq+pwPqci5B6Vd83gPtDhtRZH9wDcEAIgbnegi4kBtXaebVizRyIUuaYHsu8yMRn+TMOrYPvzwR2SBhkANhZfpFLOg94VIZPAJY1w6g1HFyDe6qbh4EGBwlR3c1f8sW80vkEBtukvgNBNvSJLeROU0S+34CvO+eTWfo+Ab6cdngx6BK+QY76+DgGCgZp3JqMvfuRJsc67zmWBKwzsaUcibupzU21I4+xv2XUgj1tp0+T87VLk3nVGYfkZ13riTH/Ut/Jv++a4D+/OT7xH1Zqh/2Odyor3mJCuoKNCtw3b0Y6Lh67Tr1KWgMIfnuCelDXmjmvnoKyZVFtvaztp738LDnU70sbniMz31/z82jD+6W3ZsW2/DA3iiAbu6mpLr/h3Sb+VbVeUkpyr1v6r7WEu3RnC6UbjhccFo/vZKT9AkBTj7cuW43OV+DNbHXwX2JsQmkgdQ7OSWmF3977eCyh9aidZCb7agOh9TY5TrZtlYPDhxPWWkjrV0RYUFnxnTs70gZt6JX3P7l/uMy59ClxOGeCmDBGmZeKMLqVQrbERy7A11XCTKA2pdMxk9JZarknyqssGXQolhR5v2lyxUnkx472Popj3ypx/pxj3zm4iT2uepj72KU9TL2mbkll2Ho4nPc76Lqd1eq3WXHYq/dmPCj6suqTn8fF2nKRet4eu5DCcdFH49NB9GoefSpqVFsSPOIlRmdBddO0Cq4nUlRa7u9g7VVg81dquXPj75WrEOrMi/XwU1ux+8n//F3onbVmSfMOvWffJ86v4IOcUHQUtK/HYswl1HlW4MAAAAASUVORK5CYII=',
        nombre: name,
        apellidos: surname,
        fecha_nac: '28/08/2003'
    }

    var userExists = false;
    var emailExists = false;
    var users =  [];
    req.session.code = null;

    readDB.getUser(username, email, function(status){
        console.log("stat" + status)
        if(!status || status == false)
            res.json('noexiste');
        else{
            res.json('existe')
        }
        
    })
/*     users.forEach(st => {
            if(st.email == email && st.username){
                console.log("bothhh")
                res.status(400).json('user');
                emailExists = true;
            }
          if(st.username == username){
            console.log("user")
            res.json('user');
            res.end();
            return;
            userExists = true;
        }
          if(st.email == email){
            console.log("email")

            console.log("hola2")
            res.status(400).json('email');
            emailExists = true;

          }
        }); */



/*          const status2 = await new Promise((resolve, reject) => {
          readDB.getUserByEmail(email, function(status) {
            resolve(status);
          });
        });
        console.log(status2);
        if (status2 == null) {
          insertDB.insertUsuari(usuari, function (status2) {
      
          });
          const ses = req.session;
          ses.user = username;
          ses.email = email;
          res.json({ redirectUrl: '/app' });
        } 
 */

        //SEND CODE
/*         var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tenarse.oficial@gmail.com',
                pass: 'tns_23/Project#'
            }
        });
    
        let mailOptions = {
            from: 'tenarse.oficial@gmail.com', 
            to: email, 
            subject: 'Verification Code',
            text: "code"
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            else{
                return console.log(info)
            }
          
        }); */
            
       
});

app.post('/verifyLogin', (req, res) => {
    var user = req.body.values[0];
    var pass = req.body.values[1];

    console.log(user)
    console.log(pass)
    readDB.getUser(user, function (status) {
        if (status == null)
            console.log("NULL");
        else {
            console.log(CryptoJS.SHA256(pass).toString())
            if (CryptoJS.SHA256(pass).toString() == status.password) {
                ses = req.session;
                ses.user = user;
                ses.email = status.email; 
                res.json({ redirectUrl: '/app' });
            }
        }
    });
});



app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/signup/index.html');
});

app.post('/getPublicacions', (req, res) => {
    readDB.getPosts(function (status) {
        res.json(status);
    })
})
app.post('/getProfiles', (req, res) => {
    readDB.getUsers(function (status) {
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
        text: '',
        url_img: 'image_post_test.png',
        url_video: '',
        likes: [],
        comentaris: [],
        owner: '645b3eb843fb7f33ac1635b9',
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
    const _id = '6448cf2c9b294335250a74ad';
    const username = 'teo.merienda'
    deleteDB.deletePost(_id, username, () => {
        res.send({ removed: true })
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            // Redirect the user to the login page after session destruction
            console.log(req.session)
            res.redirect('/sign');
        }
    });
})



app.get('/app/publicacion_template', (req, res) => {
    const productId = req.query.id
    console.log(productId)
    // Use the productId to fetch the relevant product data from your database or API
    // and pass it to the product template view
    res.sendFile(__dirname + '/publi/index.html');
})


app.post('/getPublis', (req, res) => {
    const id = req.body.values[0];
    readDB.getPublicacio(id, function (status) {
        res.json(status);

    })
    // Use the productId to fetch the relevant product data from your database or API
    // and pass it to the product template view

})


app.post('/addComment', (req, res) => {
    const id = req.body.values[0];
    const comentari = req.body.values[1];
    console.log(comentari)
    updateDB.addCommentPost(id, comentari, () => {
        readDB.getPublicacio(id, function (status) {
            res.json(status)
        })
    })
})


app.post('/newFollowing', (req, res) => {

    var followingSchema = {};

    //user_following sigue a user_followed
    var user_following = req.body.values[0]
    var user_followed = req.body.values[1]

    console.log(user_following)
    console.log(user_followed)

    /*var user_following = 'A19Narcis'
    var user_followed = 'UserTest'*/

    var userFollowedDades = ''

    readDB.getUserByID(user_followed, (dades_user) => {
        userFollowedDades = dades_user
    }).then(() => {
        followingSchema = {
            user: userFollowedDades._id
        }
    }).then(() => {
        updateDB.addFollowingUser(followingSchema, userFollowedDades, user_following, () => {
            res.send({ following: followingSchema.user })
        })
    })
})


app.post('/deleteFollowing', (req, res) => {

    //user_following deja de seguir a user_removed
    var user_following =  req.body.values[0]
    var user_removed = req.body.values[1]

    /*var user_following = 'A19Narcis'
    var user_removed = 'UserTest'*/

    updateDB.remFollowingUser(user_following, user_removed, () => {
        res.send({ stop_following: user_removed })
    })
})



app.post('/updateUser', (req, res) => {

    const id = req.body.values[0];

    const newDadesUser = {
        email: req.body.values[1],
        username: req.body.values[2],
        nombre: req.body.values[3],
        url_img: req.body.values[4],
        apellidos: req.body.values[5],
        fecha_nac: req.body.values[6]
    }
    console.log(newDadesUser)
    updateDB.updateUser(id, newDadesUser, (newDadesUpdated) => {
        res.send(newDadesUpdated)
    })
})





app.post('/upload', upload.single('image'), (req, res) => {
    // wrap readDB.getUserByEmail() in a Promise to resolve with the user ID
     const getUserId = () => {
      return new Promise((resolve, reject) => {
        readDB.getUserByEmail(req.session.email, function(status){
          resolve(status._id);
        })
      });
    }
  
    getUserId()
    .then((id) => {
      const filePath = req.file.path;
      console.log(filePath)
      
  
      fs.readFile(filePath, (err, data) => {
        if (err) throw err;
  
        console.log(id)
        const newFileName = `${id}.${"png"}`;
        console.log(newFileName)
        const newPath = `${__dirname}/uploads/${newFileName}`;
        console.log(newPath);
        fs.unlink(filePath,  (err => {}));

          fs.writeFile(newPath, data, { encoding: 'binary' }, (err) => {
            if (err) throw err;
  
            console.log(`File ${newFileName} uploaded successfully!`);
  
            res.json({ success: true });
          });
        })
    })
    .catch((err) => {
      console.error('Error getting user ID:', err);
      res.json({ success: false });
    }); 


  });