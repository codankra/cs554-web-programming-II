var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var mongoCollections = require("../config/mongoCollections");
var tasks = mongoCollections.tasks;
var ObjectID = require('mongodb').ObjectID;
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
    create: function (title, description, hoursEstimated, completed) {
        return __awaiter(this, void 0, void 0, function () {
            var taskCollection, newtask, insertInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        return [4 /*yield*/, tasks()];
                    case 1:
                        taskCollection = _a.sent();
                        newtask = {
                            title: title,
                            description: description,
                            hoursEstimated: hoursEstimated,
                            completed: completed,
                            comments: []
                        };
                        return [4 /*yield*/, taskCollection.insertOne(newtask)];
                    case 2:
                        insertInfo = _a.sent();
                        if (insertInfo.insertedCount === 0)
                            throw "Could not create task";
                        //const newId = insertInfo.insertedId;
                        return [2 /*return*/, newtask];
                }
            });
        });
    },
    getAll: function (numSkip, numShow) {
        if (numSkip === void 0) { numSkip = 0; }
        if (numShow === void 0) { numShow = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var taskCollection, tasks_new, returnable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (isNaN(numSkip))
                            throw "n query must be a number";
                        if (isNaN(numShow))
                            throw "y query must be a number";
                        if (numShow > 100)
                            numShow = 100;
                        return [4 /*yield*/, tasks()];
                    case 1:
                        taskCollection = _a.sent();
                        return [4 /*yield*/, taskCollection.find({}).toArray()]; //.slice(numSkip, numSkip+numShow);
                    case 2:
                        tasks_new = _a.sent() //.slice(numSkip, numSkip+numShow);
                        ;
                        returnable = tasks_new.slice(numSkip, numSkip + numShow);
                        return [2 /*return*/, returnable];
                }
            });
        });
    },
    get: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var taskCollection, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id)
                            throw "You must provide an id to search for";
                        isValidObjectID(id);
                        return [4 /*yield*/, tasks()];
                    case 1:
                        taskCollection = _a.sent();
                        return [4 /*yield*/, taskCollection.findOne({ _id: ObjectID(id) })];
                    case 2:
                        task = _a.sent();
                        if (task === null)
                            throw "There is no task with that id.";
                        return [2 /*return*/, task];
                }
            });
        });
    },
    updateTask: function (id, taskInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedData, taskCollection, updatedInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isValidObjectID(id);
                        updatedData = {
                            title: taskInfo.title,
                            description: taskInfo.description,
                            hoursEstimated: taskInfo.hoursEstimated,
                            completed: taskInfo.completed
                        };
                        return [4 /*yield*/, tasks()];
                    case 1:
                        taskCollection = _a.sent();
                        return [4 /*yield*/, taskCollection.updateOne({
                                _id: ObjectID(id)
                            }, {
                                $set: updatedData
                            })];
                    case 2:
                        updatedInfo = _a.sent();
                        if (updatedInfo.matchedCount === 0) {
                            throw "Task to update not found";
                        }
                        return [4 /*yield*/, this.get(id)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    addCommentToTask: function (taskId, commentName, commentComment) {
        return __awaiter(this, void 0, void 0, function () {
            var taskCollection, updatedInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isValidObjectID(taskId);
                        return [4 /*yield*/, tasks()];
                    case 1:
                        taskCollection = _a.sent();
                        return [4 /*yield*/, taskCollection.updateOne({ _id: ObjectID(taskId) }, {
                                $addToSet: {
                                    comments: {
                                        _id: new ObjectID(),
                                        name: commentName,
                                        comment: commentComment
                                    }
                                }
                            })];
                    case 2:
                        updatedInfo = _a.sent();
                        if (updatedInfo.modifiedCount === 0) {
                            throw "could not add comment successfully";
                        }
                        return [4 /*yield*/, this.get(taskId)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    removeCommentFromTask: function (taskId, commentId) {
        return __awaiter(this, void 0, void 0, function () {
            var taskCollection, updatedInfo, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isValidObjectID(taskId);
                        isValidObjectID(commentId);
                        return [4 /*yield*/, tasks()];
                    case 1:
                        taskCollection = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, taskCollection.updateOne({ _id: ObjectID(taskId) }, { $pull: { comments: { _id: ObjectID(commentId) } } })];
                    case 3:
                        updatedInfo = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        if (updatedInfo.modifiedCount === 0) {
                            throw "could not remove comment successfully, did its id ever exist?";
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
};
