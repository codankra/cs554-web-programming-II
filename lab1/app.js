const express = require("express");
const bodyParser = require("body-parser");



// We create our express isntance:
const app = express();
app.use(bodyParser.json());
//Middleware
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user comments to the server with a property called _method, rewrite the request's method
  // To be that method; so if they comment _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
  }
  // let the next middleware run:
  next();
};

//listen with routes
const configRoutes = require("./routes");
app.use(rewriteUnsupportedBrowserMethods);
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});