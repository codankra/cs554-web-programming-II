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
exports.__esModule = true;
var express = require("express");
var router = express.Router();
var taskData = require("../data/tasks");
router.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var task, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, taskData.get(req.params.id)];
            case 1:
                task = _a.sent();
                res.json(task);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.status(404).json({ error: "Task not found" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var que, skipamt, showamt, tasksList, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                que = req.query;
                skipamt = que.n ? Number(que.n) : 0;
                showamt = (que.y && que.y != '') ? Number(que.y) : 20;
                if (que.y > 100)
                    throw "Number to show must not be over 100";
                return [4 /*yield*/, taskData.getAll(skipamt, showamt)];
            case 1:
                tasksList = _a.sent();
                if (tasksList.length == 0) {
                    res.json({ status: "No tasks to show. Either populate the database more, or ease your query requirements. This is not a error or failed request, just a status message." });
                    return [2 /*return*/];
                }
                res.json(tasksList);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                res.sendStatus(500);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskInfo, newUser, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskInfo = req.body;
                if (!taskInfo) {
                    res.status(400).json({ error: "You must provide data to create a task" });
                    return [2 /*return*/];
                }
                if (!taskInfo.title) {
                    res.status(400).json({ error: "You must provide a title" });
                    return [2 /*return*/];
                }
                if (!taskInfo.description) {
                    res.status(400).json({ error: "You must provide a description" });
                    return [2 /*return*/];
                }
                if (!taskInfo.hoursEstimated) {
                    res.status(400).json({ error: "You must provide an hours estimate" });
                    return [2 /*return*/];
                }
                if (taskInfo.completed !== true) {
                    taskInfo.completed = false;
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, taskData.create(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed)];
            case 2:
                newUser = _a.sent();
                res.json(newUser);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.log(e_3);
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskInfo, e_4, updatedTask, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskInfo = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, taskData.get(req.params.id)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                res.status(404).json({ error: "Task not found" });
                return [2 /*return*/];
            case 4:
                _a.trys.push([4, 6, , 7]);
                if (!taskInfo) {
                    res.status(400).json({ error: "You must provide data to create a task" });
                    return [2 /*return*/];
                }
                if (!taskInfo.title) {
                    res.status(400).json({ error: "You must provide a title" });
                    return [2 /*return*/];
                }
                if (!taskInfo.description) {
                    res.status(400).json({ error: "You must provide a description" });
                    return [2 /*return*/];
                }
                if (!taskInfo.hoursEstimated) {
                    res.status(400).json({ error: "You must provide an hours estimate" });
                    return [2 /*return*/];
                }
                if (taskInfo.completed !== true && taskInfo.completed !== false) {
                    res.status(400).json({ error: "You must provide a t/f completed value" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, taskData.updateTask(req.params.id, taskInfo)];
            case 5:
                updatedTask = _a.sent();
                res.json(updatedTask);
                return [3 /*break*/, 7];
            case 6:
                e_5 = _a.sent();
                console.log(e_5);
                res.sendStatus(500);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.patch("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskInfo, e_6, currentTask, updatedTask, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskInfo = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, taskData.get(req.params.id)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_6 = _a.sent();
                res.status(404).json({ error: "Task not found" });
                return [2 /*return*/];
            case 4:
                _a.trys.push([4, 7, , 8]);
                return [4 /*yield*/, taskData.get(req.params.id)];
            case 5:
                currentTask = _a.sent();
                if (!taskInfo) {
                    taskInfo = currentTask;
                }
                if (!taskInfo.title) {
                    taskInfo.title = currentTask.title;
                }
                if (!taskInfo.description) {
                    taskInfo.description = currentTask.description;
                }
                if (!taskInfo.hoursEstimated) {
                    taskInfo.hoursEstimated = currentTask.hoursEstimated;
                }
                if (!taskInfo.completed) {
                    taskInfo.completed = currentTask.completed;
                }
                return [4 /*yield*/, taskData.updateTask(req.params.id, taskInfo)];
            case 6:
                updatedTask = _a.sent();
                res.json(updatedTask);
                return [3 /*break*/, 8];
            case 7:
                e_7 = _a.sent();
                console.log(e_7);
                res.sendStatus(500);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post("/:id/comments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentInfo, e_8, newCommentAdded, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentInfo = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, taskData.get(req.params.id)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_8 = _a.sent();
                res.status(404).json({ error: "Task not found" });
                return [2 /*return*/];
            case 4:
                if (!commentInfo) {
                    res.status(400).json({ error: "You must provide data to create a comment" });
                    return [2 /*return*/];
                }
                if (!commentInfo.name) {
                    res.status(400).json({ error: "You must provide a name" });
                    return [2 /*return*/];
                }
                if (!commentInfo.comment) {
                    res.status(400).json({ error: "You must provide a comment comment" });
                    return [2 /*return*/];
                }
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, taskData.addCommentToTask(req.params.id, commentInfo.name, commentInfo.comment)];
            case 6:
                newCommentAdded = _a.sent();
                res.json(newCommentAdded);
                return [3 /*break*/, 8];
            case 7:
                e_9 = _a.sent();
                console.log(e_9);
                res.sendStatus(500);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router["delete"]("/:taskId/:commentId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_10, e_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, taskData.get(req.params.taskId)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_10 = _a.sent();
                res.status(404).json({ error: "Task not found by id" });
                return [2 /*return*/];
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, taskData.removeCommentFromTask(req.params.taskId, req.params.commentId)];
            case 4:
                _a.sent();
                res.status(200).json({ status: "comment successfully deleted" });
                return [3 /*break*/, 6];
            case 5:
                e_11 = _a.sent();
                res.status(500).json(e_11);
                return [2 /*return*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
