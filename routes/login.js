const express = require("express");
const router = express.Router();
const User = require("../models/Users");
var sha256 = require('js-sha256');

function genToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
}

router.post("/", async(req, res) => {
    const {
        login,
        password
    } = req.body;
    //try to find by email OR login (which is name in database)
    try {
        const user = await User.findOne({
            $or: [{
                email: login
            }, {
                name: login
            }]
        });
        if (!user) {
            res.status(400).send({
                message: "User not found"
            });
        } else {
            if (user.password === sha256(password)) {
                if (!user.token) {
                    const token = genToken();
                    user.token = token;
                    await user.save();
                }
                const myToken = user.token;
                const name = user.name;
                res.status(200).send({
                    token: myToken,
                    name: name
                });
            } else {
                res.status(400).send({
                    message: "Wrong password"
                });
            }
        }
    } catch (err) {
        res.status(400).send(err);
    }

});

module.exports = router;