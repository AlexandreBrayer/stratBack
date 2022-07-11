const express = require("express");
const router = express.Router();
const User = require("../models/Users");
var sha256 = require('js-sha256');

router.post("/", async(req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    const user = new User({
        name,
        email,
        password: sha256(password)
    });
    try {
        await user.save();
        res.status(201).send({
            message: "User created successfully"
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;