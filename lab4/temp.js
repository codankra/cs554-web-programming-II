const bluebird = require("bluebird");
const express = require("express");
const app = express();
const redis = require("redis");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();
const dummyData = require("./dummyData.json")

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);





getById = ((id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dummyData[id]) {
          resolve(dummyData[id]);
      }else {
        reject(new Error("something went wrong"));
      }
      }, 5000);
    });
})
console.log(dummyData[1])

app.get("/api/people/:id", async (req, res) => {
  console.log(req.params.id);
  let doesIdExist = await client.existsAsync(req.params.id);
  if (doesIdExist){
    let sendable = await client.getAsync(req.params.id); 
    res.json(sendable);
  }
  let getDummyData = undefined;
  try{
    getDummyData = await getById(req.params.id);
  } catch(e){
    res.sendStatus(404).json({ERROR: "Request Failed; data can't be found"})
  }


  // let flatData = flat(getDummyData);
  // let hmSetAsyncData = await client.hmsetAsync(req.params.id, flatData);
  // client.lpushAsync("mylist",flatData);
  res.json(getDummyData);
});

app.get("/api/people/history", async (req, res) => {
  let recentsList = client.lrangeAsync("myList", 0, 19);
  res.json(recentsList);
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
