const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("*", (req, res) => {
  res.status(404).json({error: "Page not found (404)"});
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
