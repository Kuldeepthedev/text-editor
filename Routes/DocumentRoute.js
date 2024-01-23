const express = require('express');
const { getDocument, updateDocument, createDocument, getAllDocument, openDocument } = require('../Controller/DocumetnController');


const Router = express.Router();

Router.route("/createfile").post(createDocument);
Router.route("/files").get(getAllDocument);
Router.route("/files/:id").get(getDocument);
Router.route("/openfiles/:id").post(openDocument);
Router.route("/updatefile/:id").post(updateDocument);

module.exports = Router;