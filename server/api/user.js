const express = require('express');

const UserModel = require('../db/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post('/register', (req, res) => {
    const body = req.body;
    if(body.password.length >= 8){
        body.password = bcrypt.hashSync(body.password, 10);
    }

    return UserModel.register(body)
        .then((data) => {
            const cookie = {
                currUser: data.username
            }
            const token = jwt.sign(cookie, "login_credential", {
                expiresIn: "2h"
            })

            return res.cookie("jwt_token", token, {httpOnly: true})
                .status(200).send({username: data.username});
        })
        .catch(
            (err) => {
            const mesg = err.message;
            console.log("message: " + mesg)
            
            res.status(400);
            return res.send({error: mesg})}
            );
});


router.post('/authenticate', (req, res) => {
    // console.dir(req.body);
    UserModel.getUserByName(req.body.username)
        .then((user) => {
            if (bcrypt.compareSync(req.body.password, user.password)){
                const cookie = {
                    username: user.username
                }
                const token = jwt.sign(cookie, "login_credential", {
                    expiresIn: "2h"
                })

                return res.cookie('jwt_token', token, {httpOnly: true})
                    .status(200).send(user);
            } else {
                return res.status(401).send(user);
            }
        })
        .catch((err) => console.log("Error Authentication: " + err));
})


router.get("/isLoggedIn", (req, res) => {
    const jwt_token = req.cookies.jwt_token;

    if(!jwt_token){
        return res.status(401).send("No token present!");
    }

    return jwt.verify(jwt_token, "login_credential", (err, decoded) => {
        if (err) {
            return res.status(400).send("Invalid token")
        } else {
            const name = decoded.username;
            
            return res.status(200).send(name)
        }
    })
})

router.post('/logOut', (req, res) => {
    return res.cookie("jwt_token", {}, {
        maxAge: 0,
    }).send("Successfully log out")
})

router.get('/:user', (req, res) => {
    const user = req.params.user;

    return UserModel.getUserByName(user)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        })
})

router.post('/updateDescription', (req, res) => {
    const body = req.body;

    return UserModel.updateDescription(body.username, body.description)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch((err) => {
            res.status(400);
            res.send(err)
        })
})




module.exports = router;
