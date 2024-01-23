const express = require('express');
const { userLogout, resendOtp, sendOtp, userRegistration, userLogin } = require('../Controller/usercontroller');
 

const Router = express.Router();

Router.route("/sendotp").post(sendOtp);
Router.route("/resendotp").post(resendOtp);
Router.route("/userRegistration").post(userRegistration);
Router.route("/userLogin").post(userLogin);
Router.route("/userLogout").get( userLogout);
module.exports = Router;