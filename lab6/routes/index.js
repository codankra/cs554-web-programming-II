"use strict";
exports.__esModule = true;
var taskRoutes = require("./tasks");
var dict = {}; //Dict for url logging
var constructorMethod = function (app) {
    var loggers = function (req, res, next) {
        //Logger 1 ---->
        console.log("             Logger 1:");
        console.log(req.body);
        var fullurl = "http://localhost:3000" + req.originalUrl;
        console.log(fullurl);
        console.log(req.method);
        //Logger 2 ---->
        console.log("             Logger 2:");
        if (!(fullurl in dict)) {
            dict[fullurl] = 1;
        }
        else {
            dict[fullurl]++;
        }
        var key;
        for (key in dict) {
            console.log(key + " requested " + dict[key] + " time(s).");
        }
        console.log("-----------------------------------");
        next();
    };
    app.use(loggers);
    app.use("/api/tasks", taskRoutes);
    app.use("*", function (req, res) {
        res.status(404).json({ error: "Not found" });
    });
};
module.exports = constructorMethod;
