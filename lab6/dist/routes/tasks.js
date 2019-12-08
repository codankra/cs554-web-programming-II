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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const router = express.Router();
const taskData = require("../data/tasks");
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield taskData.get(req.params.id);
        res.json(task);
    }
    catch (e) {
        res.status(404).json({ error: "Task not found" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const que = req.query;
        const skipamt = que.n ? Number(que.n) : 0;
        const showamt = (que.y && que.y != '') ? Number(que.y) : 20; //default show <UP TO> 20 (if 20 exist)
        if (que.y > 100)
            throw "Number to show must not be over 100";
        const tasksList = yield taskData.getAll(skipamt, showamt);
        if (tasksList.length == 0) {
            res.json({ status: "No tasks to show. Either populate the database more, or ease your query requirements. This is not a error or failed request, just a status message." });
            return;
        }
        res.json(tasksList);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskInfo = req.body;
    if (!taskInfo) {
        res.status(400).json({ error: "You must provide data to create a task" });
        return;
    }
    if (!taskInfo.title) {
        res.status(400).json({ error: "You must provide a title" });
        return;
    }
    if (!taskInfo.description) {
        res.status(400).json({ error: "You must provide a description" });
        return;
    }
    if (!taskInfo.hoursEstimated) {
        res.status(400).json({ error: "You must provide an hours estimate" });
        return;
    }
    if (taskInfo.completed !== true) {
        taskInfo.completed = false;
    }
    try {
        const newUser = yield taskData.create(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed);
        res.json(newUser);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskInfo = req.body;
    try {
        yield taskData.get(req.params.id);
    }
    catch (e) {
        res.status(404).json({ error: "Task not found" });
        return;
    }
    try {
        if (!taskInfo) {
            res.status(400).json({ error: "You must provide data to create a task" });
            return;
        }
        if (!taskInfo.title) {
            res.status(400).json({ error: "You must provide a title" });
            return;
        }
        if (!taskInfo.description) {
            res.status(400).json({ error: "You must provide a description" });
            return;
        }
        if (!taskInfo.hoursEstimated) {
            res.status(400).json({ error: "You must provide an hours estimate" });
            return;
        }
        if (taskInfo.completed !== true && taskInfo.completed !== false) {
            res.status(400).json({ error: "You must provide a t/f completed value" });
            return;
        }
        const updatedTask = yield taskData.updateTask(req.params.id, taskInfo);
        res.json(updatedTask);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let taskInfo = req.body;
    try {
        yield taskData.get(req.params.id);
    }
    catch (e) {
        res.status(404).json({ error: "Task not found" });
        return;
    }
    try {
        //interrogation
        const currentTask = yield taskData.get(req.params.id);
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
        const updatedTask = yield taskData.updateTask(req.params.id, taskInfo);
        res.json(updatedTask);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}));
router.post("/:id/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentInfo = req.body;
    try {
        yield taskData.get(req.params.id);
    }
    catch (e) {
        res.status(404).json({ error: "Task not found" });
        return;
    }
    if (!commentInfo) {
        res.status(400).json({ error: "You must provide data to create a comment" });
        return;
    }
    if (!commentInfo.name) {
        res.status(400).json({ error: "You must provide a name" });
        return;
    }
    if (!commentInfo.comment) {
        res.status(400).json({ error: "You must provide a comment comment" });
        return;
    }
    try {
        const newCommentAdded = yield taskData.addCommentToTask(req.params.id, commentInfo.name, commentInfo.comment);
        res.json(newCommentAdded);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}));
router.delete("/:taskId/:commentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield taskData.get(req.params.taskId);
    }
    catch (e) {
        res.status(404).json({ error: "Task not found by id" });
        return;
    }
    try {
        yield taskData.removeCommentFromTask(req.params.taskId, req.params.commentId);
        res.status(200).json({ status: "comment successfully deleted" });
    }
    catch (e) {
        res.status(500).json(e);
        return;
    }
}));
module.exports = router;
