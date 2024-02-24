const express = require("express");
const userMiddleWare = require("../middleware/userAccess");
const chatRoute = express.Router();


chatRoute.route("/chats/:user").post(adminMiddleware, getusers);
chatRoute.route("/chats/:user/:id").get(adminMiddleware, getusers);
chatRoute.route("/chats").get(adminMiddleware, getusers);
chatRoute.route("/chats/:id").get(userMiddleWare, getSingleUser);
chatRoute
  .route("/chats/:id")
  .patch(userMiddleWare, UpdatebyMiddleWare, updateUser);
chatRoute
  .route("/chats/:id")
  .put(userMiddleWare, UpdatebyMiddleWare, updateUser);
chatRoute.route("/chats/:id").delete(adminMiddleware, deleteUser);



module.exports = authRoute;
