const express = require('express');
const { getDocument, updateDocument, createDocument, getAllDocument, openDocument } = require('../Controller/DocumetnController');
const requireAuth = require("../Middleware/authMiddleware")

const Router = express.Router();

Router.route("/createfile").post(requireAuth,createDocument);
Router.route("/files").get(getAllDocument);
Router.route("/files/:id").get(requireAuth,getDocument);
Router.route("/openfiles/:id").post(requireAuth,openDocument);
Router.route("/updatefile/:id").post(requireAuth,updateDocument);

module.exports = Router;