const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if(userExists) {   
        res.send(
            {   success: false,
                message: "User with this email already exists" }
        );        
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    try {
        const user = new User(req.body);
        await user.save();
    
    } catch (error) {
        res.json({ message: error });
    }
    res.status(201).json({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.send({
            success: false,
            message: "User not found"
        });      
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.send({
            success: false,
            message: "Incorrect password"
        });
    }
    res.send({
        success: true,
        message: "User logged in successfully"
    });
});
module.exports = router;