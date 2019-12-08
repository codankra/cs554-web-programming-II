const taskRoutes = require("./tasks");
import * as express from "express";

type MyMapLikeType = Record<string, number>;
let dict: MyMapLikeType = {}; //Dict for url logging

const constructorMethod = (app : express.Application) => {
  
  const loggers = (req: express.Request, res: express.Response, next: express.NextFunction) => { 
    //Logger 1 ---->
    console.log("             Logger 1:");
    console.log(req.body);
    const fullurl: string = "http://localhost:3000" + req.originalUrl;
    console.log(fullurl);
    console.log(req.method);
    //Logger 2 ---->
    console.log("             Logger 2:");
    if(!(fullurl in dict)) {
      dict[fullurl] = 1;
    } else {
      dict[fullurl]++;
    }
    let key: string;
    for(key in dict){
      console.log(`${key} requested ${dict[key]} time(s).`)
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