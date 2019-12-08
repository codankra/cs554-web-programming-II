"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
var configRoutes = require("./routes");
configRoutes(app);
app.listen(3000, function () {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
