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
        //if there is strats without side, then set side to none
        for (let i = 0; i < strat.length; i++) {
            if (!strat[i].side) {
                strat[i].side = "none";
            }
        }
        //save strats
        for (let i = 0; i < strat.length; i++) {
            await strat[i].save();
        }
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

router.get("/roll/:side", async(req, res) => {
    try {
        let side
        req.params.side == "1" ? side = "ct" : side = "t";
        const strat = await Strat.find({
            $or: [{
                side: side
            }, {
                side: "none"
            }]
        });
        const random = Math.floor(Math.random() * strat.length);
        if (strat[random].vars != {}) {
            strat[random].description = populateVars(strat[random]);
        }
        res.status(200).send(strat[random]);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get("/:id", async(req, res) => {
    console.log(req.params.id);
    try {
        const strat = await Strat.findById(req.params.id);
        res.status(200).send(strat);
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

router.post("/upvote", async(req, res) => {
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
    const strat = await Strat.findById(req.body.id);
    if (strat.upVoters.includes(user._id)) {
        strat.upVoters.splice(strat.upVoters.indexOf(user._id), 1);
        strat.upvotes--;
        try {
            await strat.save();
            res.status(200).send(strat);
        } catch (err) {
            res.status(400).send(err);
        }
        return
    }
    if (strat.downVoters.includes(user._id)) {
        strat.downVoters.splice(strat.downVoters.indexOf(user._id), 1);
        strat.downvotes--;
    }
    strat.upVoters.push(user._id);
    strat.upvotes++;
    try {
        await strat.save();
        res.status(200).send(strat);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post("/downvote", async(req, res) => {
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
    const strat = await Strat.findById(req.body.id);
    if (strat.downVoters.includes(user._id)) {
        strat.downVoters.splice(strat.downVoters.indexOf(user._id), 1);
        strat.downvotes--;
        try {
            await strat.save();
            res.status(200).send(strat);
        } catch (err) {
            res.status(400).send(err);
        }
        return
    }
    if (strat.upVoters.includes(user._id)) {
        strat.upVoters.splice(strat.upVoters.indexOf(user._id), 1);
        strat.upvotes--;
    }
    strat.downVoters.push(user._id);
    strat.downvotes++;
    try {
        await strat.save();
        res.status(200).send(strat);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;