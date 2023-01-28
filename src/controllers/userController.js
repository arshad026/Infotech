const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const nodemailer = require('nodemailer')


const nameRegex = /^[a-zA-Z ]{2,30}$/
const emailRegex = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/


const userCreate = async function (req, res) {

    try {
        let data = req.body
        let { Name, Email, Password, confirmPassword } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'please provide some data' })
        }
        if (!Name) return res.status(400).send({ status: false, message: "Please Provide Name" })
        if (!nameRegex.test(Name)) return res.status(400).send({ status: false, message: "Please Provide Valid Name" })

        if (!Email) return res.status(400).send({ status: false, message: "Please Provide Email" })
        if (!emailRegex.test(Email)) return res.status(400).send({ status: false, message: "Please Provide Valid Email" })

        let duplicateEmail = await userModel.findOne({ Email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "Email is already registered!" })

        if (!Password) return res.status(400).send({ status: false, message: 'please provide Password' })
        if (!passwordRegex.test(Password)) return res.status(400).send({ status: false, message: 'please provide valid Password' })

        if (!confirmPassword) return res.status(400).send({ status: false, message: 'please provide Confirm Password' })
        if (!passwordRegex.test(confirmPassword)) return res.status(400).send({ status: false, message: 'please provide valid Password' })


        const userData = await userModel.create(data)
        res.status(201).send({ status: true, message: 'user created successfully', data: userData })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}




const userLogin = async function (req, res) {

    try {
        let data = req.body
        const { Email, Password } = data

        if (Object.keys(data).length === 0) {
            res.status(400).send({ status: false, message: 'please provide some data' })
        }

        if (!Email) return res.status(400).send({ status: false, message: 'Email is required' })

        if (!Password) return res.status(400).send({ status: false, message: 'password is required' })

        let user = await userModel.findOne({ Email, Password })
        if (!user) return res.status(400).send({ status: false, message: "Email or Password is incorrect" })

        let token = jwt.sign({
            userId: user._id,

        }, 'my assignment for INFOTECH',
            { expiresIn: "24hr" })

        res.status(201).send({ status: true, message: 'token created successfully', data: token })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}



const sendresetPasswordMail = async function (name, email, token) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "babudan517@gmail.com",
                pass: "cnzupbqeyhqgmlde"
            }
        });

        const mailOptions = {
            from: "babudan517@gmail.com",
            to: email,
            subject: 'For reset password',
            html: '<p>  hi ' + name + ' ,please copy the link and <a href="http://127.0.0.1:3000/api/reset-password?token=' + token + '"> reset your password </a>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Mail has been sent :-", info.response);
            }
        });

    } catch (err) {
        return res.status(400).send({ status: false, message: err.message });
    }
}



const forgetPassword = async function (req, res) {
    try {
        let data = req.body;
        let { Email } = data;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide some data" });

        if (!Email) return res.status(400).send({ status: false, message: "Please Provide Email" })
        if (!emailRegex.test(Email)) return res.status(400).send({ status: false, message: "Please Provide Valid Email" })

        const userdata = await userModel.findOne({ Email })

        if (userdata) {
            const randomString = randomstring.generate();
            await userModel.updateOne({ Email }, { $set: { token: randomString } });
            sendresetPasswordMail(userdata.Name, userdata.Email, randomString);

            res.status(200).send({ status: true, message: "please check your Email and reset the password" })
        } else {
            return res.status(404).send({ status: true, message: "this Email does not exist" });
        }

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
}



const resetPassword = async function (req, res) {
    try {
        const token = req.query.token;
        const tokenData = await userModel.findOne({ token: token });
        const Password = req.body.Password;

        if (!Password) return res.status(400).send({ status: false, message: 'please provide Password' })
        if (!passwordRegex.test(Password)) return res.status(400).send({ status: false, message: 'please provide valid Password' })

        if (tokenData) {
            const userData = await userModel.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: Password, token: '' } }, { new: true });

            return res.status(200).send({ status: true, message: "user password has been reset", data: userData })

        } else {
            return res.status(400).send({ status: false, message: "this link is wrong or expired" });
        }

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
}



module.exports = { userCreate, userLogin, forgetPassword, resetPassword, sendresetPasswordMail }