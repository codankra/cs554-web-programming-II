const taskRoutes = require("./tasks");
let dict = {}; //Dict for url logging

const constructorMethod = app => {
  
  const loggers = (req, res, next) => {
    //Logger 1 ---->
    console.log("             Logger 1:");
    console.log(req.body);
    const fullurl = "http://localhost:3000" + req.originalUrl;
    console.log(fullurl);
    console.log(req.method);
    //Logger 2 ---->
    console.log("             Logger 2:");
    if(!(fullurl in dict)) {
      dict[fullurl] = 1;
    } else {
      dict[fullurl]++;
    }
    for(key in dict){
      console.log(key + " requested " + dict[key] + " time(s).")
    }
    console.log("-----------------------------------");
    next();
  };
  app.use(loggers);
  app.use("/api/tasks", taskRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;