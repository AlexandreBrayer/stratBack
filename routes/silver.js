const express = require("express");
const router = express.Router();
const User = require("../models/Users");
var sha256 = require('js-sha256');

router.get('/', async(req, res) => {
    const token = req.headers.authorization;
    try {
        const user = await User.find({ silver: true });
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

router.post('/', async(req, res) => {
    const {
        login,
        password,
        secret
    } = req.body;
    const now = new Date();
    if (secret === process.env.SECRET) {
        const user = new User({
            name: login,
            password: sha256(password),
            silver: true,
            email: login + "@silver.com",
            unbanned: now
        });
        try {
            await user.save();
            res.status(200).send(user);
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send({
            message: "Wrong secret"
        });
    }
})

router.post('/ban', async(req, res) => {
    const token = req.headers.authorization;
    const {
        timestamp,
        id
    } = req.body;
    const user = await User.findOne({ token: token, silver: true });
    if (!user) {
        res.status(401).send({
            message: "You are not logged in"
        });
        return
    }
    const silver = await User.findOne({ _id: id, silver: true });
    if (!silver) {
        res.status(401).send({
            message: "Not a silver account that you can ban"
        });
        return
    }
    silver.unbanned = timestamp;
    await silver.save();
    res.status(200).send(silver);
})

module.exports = router;