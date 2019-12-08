const bluebird = require("bluebird");
const express = require("express");
const app = express();
const redis = require("redis");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();
const dataFile = require("./dataFile.json")

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

getById = ((id) => {
  return new Promise((resolve, reject) => {
  setTimeout(() => {
  if (dataFile[id-1]) {
  resolve(dataFile[id-1]);
  } else {
  reject(new Error("something went wrong"));
  }
  }, 5000);
});
})

app.get("/api/people/history", async (req, res) => {
  let listory = await client.lrangeAsync("myList", 0, 19); //Inclusive Indexes
  res.json(listory);
});

app.get("/api/people/:id", async (req, res) => {
  // console.log(req.params.id);
  let idAlreadyExists = await client.existsAsync(req.params.id);
  if (idAlreadyExists){
    let sendable = await client.hgetallAsync(req.params.id);
    let unflattable = unflatten(sendable);
    await client.lpushAsync("myList",JSON.stringify(unflattable));
    res.json(sendable);
    return;
  }
  try{
    let getFromDataset = await getById(req.params.id);
    await client.lpushAsync("myList",JSON.stringify(getFromDataset));
    let flatData = flat(getFromDataset);
    let hmSetAsyncData = await client.hmsetAsync(flatData.id, flatData);
    res.json(getFromDataset);
  } catch(e){
    res.status(404).json({ERROR: "Request Failed! 404, data can't be found"})
  }
  
});



app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
