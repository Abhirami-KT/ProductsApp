const mongoose = require('mongoose')
const users = require('../Models/userSchema')
const bcrypt = require('bcrypt')

//Register logic
exports.registerAPI = async (req, res) => {

    console.log("Inside Register API")
    const { username, email, password } = req.body
    const existingUser = await users.findOne({ email })
    if (existingUser) {
        return res.status(400).json("User already exists!! Please login!!")
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new users({
        username,
        email,
        password: hashedPassword
    })
    await newUser.save()
    res.status(200).json({newUser})
}

//Login logic
exports.loginAPI = async (req, res) => {
    console.log("Inside login logic");
    const { email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            // Compare the plain-text password with the hashed password using bcrypt.compare
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (isPasswordValid) {
                res.status(200).json({ existingUser });
            } else {
                // Password does not match
                res.status(402).json("Incorrect password");
            }
        } else {
            // User does not exist
            res.status(404).json("Invalid user");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error");
    }
};
