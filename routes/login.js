const express = require("express");
const router = express.Router();
const User = require("../models/Users");
var sha256 = require('js-sha256');

function genToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
}
router.get("/", async(req, res) => {
    const token = req.headers.authorization;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            res.status(401).send({
                message: "You are not logged in"
            });
            return
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
})
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
                res.status(200).send(user);
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