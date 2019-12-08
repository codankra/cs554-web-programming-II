const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const ObjectID = require('mongodb').ObjectID;

function isValidObjectID(input: any) {
    try{
        ObjectID.createFromHexString(input);
    }catch(e){
        throw input + " is not a valid/existing ObjectID";
    }
}
function isString(input: any) {
    if (typeof input === 'string' || input instanceof String){
        return true;
    }
    else{
        throw "Your input " + input + " is not a string";
    }
}

module.exports = {
    async create(title: string, description: string, hoursEstimated: number, completed : boolean){ //post (3)
        //validate input (not needed really bc done on route but doesn't hurt)
        //make sure task can be created
        if (!title) throw "You must provide a name for your task";
        if (!description) throw "You must provide a description for your task";
        if (!hoursEstimated) throw "You must provide an estimate for your task";
        isString(title);
        isString(description);
        if (isNaN(hoursEstimated)) throw "must provide hours estimated as a number";
        const taskCollection = await tasks();
        let newtask = {
            title: title,
            description: description,
            hoursEstimated: hoursEstimated,
            completed: completed,
            comments: []

        }
        const insertInfo = await taskCollection.insertOne(newtask);
        if (insertInfo.insertedCount === 0) throw "Could not create task";

        //const newId = insertInfo.insertedId;
        return newtask;
    },
    async getAll(numSkip = 0, numShow = 20) { //get (1)
        if (isNaN(numSkip)) throw "n query must be a number";
        if (isNaN(numShow)) throw "y query must be a number";
        if (numShow > 100) numShow = 100;
        const taskCollection = await tasks();
        const tasks_new = await taskCollection.find({}).toArray() //.slice(numSkip, numSkip+numShow);
        var returnable = tasks_new.slice(numSkip, numSkip+numShow);
        return returnable;
    },
    async get(id: string) { //get (2)
        if (!id) throw "You must provide an id to search for";
        isValidObjectID(id);
    
        const taskCollection = await tasks();
        const task = await taskCollection.findOne({ _id: ObjectID(id) });
        if (task === null) throw "There is no task with that id.";

        return task;
    },
    async updateTask(id: string, taskInfo: any) {
      isValidObjectID(id);
      const updatedData = {
      title: taskInfo.title,
      description: taskInfo.description,
      hoursEstimated: taskInfo.hoursEstimated,
      completed: taskInfo.completed
      };
      const taskCollection = await tasks();
      
      const updatedInfo = await taskCollection.updateOne({
      _id: ObjectID(id)
      }, {
      $set: updatedData
      });
      if (updatedInfo.matchedCount === 0) {
      throw "Task to update not found";
      }
      return await this.get(id);
    },
    async addCommentToTask(taskId: string, commentName: string, commentComment:string) {
      isValidObjectID(taskId);
      const taskCollection = await tasks();
      const updatedInfo = await taskCollection.updateOne({ _id: ObjectID(taskId) }, {
        $addToSet: {
          comments: { 
            _id: new ObjectID(),
            name: commentName, 
            comment: commentComment 
          }
        }
      });
        if (updatedInfo.modifiedCount === 0) {
            throw "could not add comment successfully";
        }
    
        return await this.get(taskId);
      
    },
    async removeCommentFromTask(taskId: string, commentId: string) {
      isValidObjectID(taskId);
      isValidObjectID(commentId);
      const taskCollection = await tasks();
      var updatedInfo;
      try{
        updatedInfo = await taskCollection.updateOne({ _id: ObjectID(taskId) }, {$pull : {comments: { _id: ObjectID(commentId) }}});
      }catch(e){
        console.log(e);
      }
      if (updatedInfo.modifiedCount === 0) {
          throw "could not remove comment successfully, did its id ever exist?";
      }
  
      return;
    }
};