const express = require("express");
const { register, login, logout, refresh, verify, confirm, reset, forget, changes, profile,update } = require("../controller/auth");
const userMiddleWare = require("../middleware/userAccess");
const authRoute = express.Router();


authRoute.route("/user/authentication/register").post(register);
authRoute.route("/user/authentication/signin").post(login);
authRoute.route("/user/authentication/signout").post(logout);
authRoute.route("/user/authentication/token/refersh").post(refresh);
authRoute.route("/user/authentication/verify/auth-token").post(verify);
authRoute.route("/user/authentication/confirm/:token").post(confirm);
authRoute.route("/user/authentication/reset-password/:token").post(reset);
authRoute.route("/user/authentication/forget-password").post(forget);
authRoute.route("/user/authentication/change-password").post(userMiddleWare,changes);
authRoute.route("/user/authentication/current/profile").get(userMiddleWare,profile);
authRoute.route("/user/authentication/current/profile/update/:id").patch(userMiddleWare,update);



module.exports = authRoute;
