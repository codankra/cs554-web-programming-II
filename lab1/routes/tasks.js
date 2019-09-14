const express = require("express");
const router = express.Router();
const taskData = require("../data/tasks");

router.get("/:id", async (req, res) => {
  try {
    const task = await taskData.get(req.params.id);
    res.json(task);
  } catch (e) {
    res.status(404).json({ error: "Task not found" });
  }
});
router.get("/", async (req, res) => {
  try {
    const que = req.query;
    const skipamt = que.n ? Number(que.n) : 0;
    const showamt = (que.y && que.y != '') ? Number(que.y) : 20; //default show <UP TO> 20 (if 20 exist)
    if (que.y>100) throw "Number to show must not be over 100";
    const tasksList = await taskData.getAll(skipamt, showamt);
    if(tasksList.length == 0) {
      res.json({status: "No tasks to show. Either populate the database more, or ease your query requirements. This is not a error or failed request, just a status message."});
      return;
    }
    res.json(tasksList);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
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
    const newUser = await taskData.create(
      taskInfo.title,
      taskInfo.description,
      taskInfo.hoursEstimated,
      taskInfo.completed
    );
    res.json(newUser);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
  const taskInfo = req.body;
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({error: "Task not found"});
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
    const updatedTask = await taskData.updateTask(req.params.id, taskInfo);
    res.json(updatedTask);
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});

router.patch("/:id", async (req, res) => {
  const taskInfo = req.body;
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({error: "Task not found"});
    return;
  }
  try {
    //interrogation
    const currentTask = await taskData.get(req.params.id);
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
    const updatedTask = await taskData.updateTask(req.params.id, taskInfo);
    res.json(updatedTask);
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});

router.post("/:id", async (req, res) => {
  const commentInfo = req.body;
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({error: "Task not found"});
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
    const newCommentAdded = await taskData.addCommentToTask(
      req.params.id,
      commentInfo.name,
      commentInfo.comment
    );
    res.json(newCommentAdded);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete("/:taskId/:commentId", async (req, res) => {
  try {
    await taskData.get(req.params.taskId);
  } catch (e) {
    res.status(404).json({ error: "Task not found by id" });
    return;
  }
  try {
    await taskData.removeCommentFromTask(req.params.taskId, req.params.commentId);
    res.status(200).json({ status: "comment successfully deleted" });
  } catch (e) {
    res.status(500).json(e);
    return;
  }
});




module.exports = router;