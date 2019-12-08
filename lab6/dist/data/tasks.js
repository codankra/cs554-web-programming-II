"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const ObjectID = require('mongodb').ObjectID;
function isValidObjectID(input) {
    try {
        ObjectID.createFromHexString(input);
    }
    catch (e) {
        throw input + " is not a valid/existing ObjectID";
    }
}
function isString(input) {
    if (typeof input === 'string' || input instanceof String) {
        return true;
    }
    else {
        throw "Your input " + input + " is not a string";
    }
}
module.exports = {
    create(title, description, hoursEstimated, completed) {
        return __awaiter(this, void 0, void 0, function* () {
            //validate input (not needed really bc done on route but doesn't hurt)
            //make sure task can be created
            if (!title)
                throw "You must provide a name for your task";
            if (!description)
                throw "You must provide a description for your task";
            if (!hoursEstimated)
                throw "You must provide an estimate for your task";
            isString(title);
            isString(description);
            if (isNaN(hoursEstimated))
                throw "must provide hours estimated as a number";
            const taskCollection = yield tasks();
            let newtask = {
                title: title,
                description: description,
                hoursEstimated: hoursEstimated,
                completed: completed,
                comments: []
            };
            const insertInfo = yield taskCollection.insertOne(newtask);
            if (insertInfo.insertedCount === 0)
                throw "Could not create task";
            //const newId = insertInfo.insertedId;
            return newtask;
        });
    },
    getAll(numSkip = 0, numShow = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(numSkip))
                throw "n query must be a number";
            if (isNaN(numShow))
                throw "y query must be a number";
            if (numShow > 100)
                numShow = 100;
            const taskCollection = yield tasks();
            const tasks_new = yield taskCollection.find({}).toArray(); //.slice(numSkip, numSkip+numShow);
            var returnable = tasks_new.slice(numSkip, numSkip + numShow);
            return returnable;
        });
    },
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw "You must provide an id to search for";
            isValidObjectID(id);
            const taskCollection = yield tasks();
            const task = yield taskCollection.findOne({ _id: ObjectID(id) });
            if (task === null)
                throw "There is no task with that id.";
            return task;
        });
    },
    updateTask(id, taskInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            isValidObjectID(id);
            const updatedData = {
                title: taskInfo.title,
                description: taskInfo.description,
                hoursEstimated: taskInfo.hoursEstimated,
                completed: taskInfo.completed
            };
            const taskCollection = yield tasks();
            const updatedInfo = yield taskCollection.updateOne({
                _id: ObjectID(id)
            }, {
                $set: updatedData
            });
            if (updatedInfo.matchedCount === 0) {
                throw "Task to update not found";
            }
            return yield this.get(id);
        });
    },
    addCommentToTask(taskId, commentName, commentComment) {
        return __awaiter(this, void 0, void 0, function* () {
            isValidObjectID(taskId);
            const taskCollection = yield tasks();
            const updatedInfo = yield taskCollection.updateOne({ _id: ObjectID(taskId) }, {
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
            return yield this.get(taskId);
        });
    },
    removeCommentFromTask(taskId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            isValidObjectID(taskId);
            isValidObjectID(commentId);
            const taskCollection = yield tasks();
            var updatedInfo;
            try {
                updatedInfo = yield taskCollection.updateOne({ _id: ObjectID(taskId) }, { $pull: { comments: { _id: ObjectID(commentId) } } });
            }
            catch (e) {
                console.log(e);
            }
            if (updatedInfo.modifiedCount === 0) {
                throw "could not remove comment successfully, did its id ever exist?";
            }
            return;
        });
    }
};
