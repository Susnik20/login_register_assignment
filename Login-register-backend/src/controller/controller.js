const userModel = require('../model/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
let nameRegex = /^([a-zA-Z ])+$/;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
const isValid = function (x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};
const isValidBody = function (x) {
    return Object.keys(x).length > 0;
};
const register = async function (req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        let body = req.body;
        console.log(body)
        if (!isValidBody(body)) return res.status(400).send({ status: false, message: 'Please enter another detail' });
        let { name, email, password } = body;
        if (!isValid(name)) return res.status(400).send({ status: false, message: 'User name is required. Please enter name' });
        if (!isValid(email)) return res.status(400).send({ status: false, message: 'Email is required. Please enter email' });
        if (!isValid(password)) return res.status(400).send({ status: false, message: 'Password is required. Please enter password' });
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, message: 'User name is not valid. Please enter a valid user name' });
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: 'Email is not valid. Please enter a valid email' });
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: 'Password is not valid. Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & # ] and length should be min of 8-15 charachaters' });
        const findUserData = await userModel.findOne({ email: email });
        if (findUserData) return res.status(400).send({ status: false, message: 'Email is already registered. Please enter another email' });
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        let validatedData = { name, email, password: encryptedPassword };
        let userData = await userModel.create(validatedData);
        return res.status(201).send({ status: true, data: userData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
const login = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        let body = req.body;
       
        if (!isValidBody(body)) return res.status(400).send({ status: false, message: 'Please enter another detail' });
        let { email, password } = body;
        if (!isValid(email)) return res.status(400).send({ status: false, message: 'Email is required. Please enter email' });
        if (!isValid(password)) return res.status(400).send({ status: false, message: 'Password is required. Please enter password' });
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: 'Email is not valid. Please enter a valid email' });
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: 'Password is not valid. Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & # ] and length should be min of 8-15 charachaters' });
        let userData = await userModel.findOne({ email: email });
        if (!userData) return res.status(404).send({ status: false, message: 'User does not exist. Please register to login' });
        let verifiedPassword = await bcrypt.compare(password, userData.password);
        if (!verifiedPassword) return res.status(400).send({message: 'Wrong password. Please enter a valid password' });
        let token = jwt.sign({
            userId: userData._id.toString(),
        },
            'Akoi',
            { expiresIn: '1h' }
        );
        return res.status(200).send({status: true, data: token});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { register, login };