const express = require("express");
const router = express.Router();
const Strat = require("../models/Strat");
const User = require("../models/Users");

function populateVars(strat) {
    let description = strat.description;
    for (let varName in strat.vars) {
        let randomValue = strat.vars[varName][Math.floor(Math.random() * strat.vars[varName].length)];
        description = description.replace(varName, randomValue);
    }
    return description
}

router.get("/", async(req, res) => {
    try {
        const strat = await Strat.find();
        res.status(200).send(strat);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/roll", async(req, res) => {
    //send a random strat from the database
    try {
        const strat = await Strat.find();
        const random = Math.floor(Math.random() * strat.length);
        if (strat[random].vars != {}) {
            strat[random].description = populateVars(strat[random]);
        }
        res.status(200).send(strat[random]);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post("/", async(req, res) => {
    const token = req.headers.authorization;
    const user = await User.findOne({
        token
    });
    if (!user) {
        res.status(401).send({
            message: "You are not logged in"
        });
        return
    }
    const strat = new Strat(req.body);
    try {
        await strat.save();
        res.status(201).send(strat);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post("/vote", async(req, res) => {
    const token = req.headers.authorization;
    const user = await User.findOne({
        token
    });
    if (!user) {
        res.status(401).send({
            message: "You are not logged in"
        });
        return
    }
    const {
        vote,
        stratId
    } = req.body;
    try {
        const strat = await Strat.findById(stratId);
        if (vote === "up") {
            strat.upvotes++;
        } else {
            strat.downvotes++;
        }
        await strat.save();
        res.status(200).send(strat);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;