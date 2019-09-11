const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const ObjectID = require('mongodb').ObjectID;

function isValidObjectID(input) {
    try{
        ObjectID.createFromHexString(input);
    }catch(e){
        throw input + " is not a valid/existing ObjectID";
    }
}
function isString(input) {
    if (typeof input === 'string' || input instanceof String){
        return true;
    }
    else{
        throw "Your input " + input + " is not a string";
    }
}

module.exports = {
    async create(title, description, hoursEstimated, completed){ //post (3)
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
    async get(id) { //get (2)
        if (!id) throw "You must provide an id to search for";
        isValidObjectID(id);
    
        const taskCollection = await tasks();
        const task = await taskCollection.findOne({ _id: ObjectID(id) });
        if (task === null) throw "There is no task with that id.";
    
        return task;
      },
    async remove(id) {
        if (!id) throw "You must provide an id to remove";
        isValidObjectID(id);
        const taskByID = await this.get(id);
        const taskCollection = await tasks();
        const deletionInfo = await taskCollection.removeOne(taskByID);
    
        if (deletionInfo.deletedCount === 0) {
          throw `Could not remove task with id of ${id}`;
        }
        return taskByID;
    },
    async updateTask(id, taskInfo) {
      const updatedData = {
      title: taskInfo.title,
      description: taskInfo.description,
      hoursEstimated: taskInfo.hoursEstimated,
      completed: taskInfo.completed
      };
      const taskCollection = await tasks();
      
      const updatedInfo = await taskCollection.updateOne({
      _id: id
      }, {
      $set: updatedData
      });
      if (updatedInfo.matchedCount === 0) {
      throw "Task to update not found";
      }
      return await this.getTaskById(id);
    },
    async updateOne(id, aData) {
        if (!id) 
            throw "You must provide an id to search for";
        isValidObjectID(id);
        const taskCollection = await tasks();
        if (aData.newName){
            isString(aData.newName);
            const updatedInfo = await taskCollection.updateOne({ _id: ObjectID(id) }, {$set : {"name": aData.newName}});
            if (updatedInfo.modifiedCount === 0) {
                throw "could not rename task successfully or new name is same as old name.";
            }
        }
        if (aData.newDescription){
            isString(aData.newDescription);
            const updatedInfo = await taskCollection.updateOne({ _id: ObjectID(id) }, {$set : {"taskType": aData.newDescription}});
            if (updatedInfo.modifiedCount === 0) {
                throw "could not retype task successfully or new type is same as old type.";
            }
        }

    
        return await this.get(id);
    },
    async updateAll(id, aData) {
        if (!id) 
            throw "You must provide an id to search for";
        isValidObjectID(id);
        const taskCollection = await tasks();
        if (aData.newName){
            isString(aData.newName);
            const updatedInfo = await taskCollection.updateOne({ _id: ObjectID(id) }, {$set : {"name": aData.newName}});
            if (updatedInfo.modifiedCount === 0) {
                throw "could not rename task successfully or new name is same as old name.";
            }
        }
        if (aData.newType){
            isString(aData.newType);
            const updatedInfo = await taskCollection.updateOne({ _id: ObjectID(id) }, {$set : {"taskType": aData.newType}});
            if (updatedInfo.modifiedCount === 0) {
                throw "could not retype task successfully or new type is same as old type.";
            }
        }
        return await this.get(id);
    },
    addCommentToUser(userId, commentId, commentTitle) {
        return this.getUserById(id).then(currentUser => {
          return userCollection.updateOne(
            { _id: id },
            {
              $addToSet: {
                comments: {
                  id: commentId,
                  title: commentTitle
                }
              }
            }
          );
        });
      },
      removeCommentFromUser(userId, commentId) {
        return this.getUserById(id).then(currentUser => {
          return userCollection.updateOne(
            { _id: id },
            {
              $pull: {
                comments: {
                  id: commentId
                }
              }
            }
          );
        });
      }
};