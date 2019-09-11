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
    res.json(tasksList);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  const userInfo = req.body;

  if (!userInfo) {
    res.status(400).json({ error: "You must provide data to create a user" });
    return;
  }

  if (!userInfo.title) {
    res.status(400).json({ error: "You must provide a title" });
    return;
  }

  if (!userInfo.description) {
    res.status(400).json({ error: "You must provide a description" });
    return;
  }
  if (!userInfo.hoursEstimated) {
    res.status(400).json({ error: "You must provide an hours estimate" });
    return;
  }
  if (userInfo.completed !== true && userInfo.completed !== false) {
    res.status(400).json({ error: "You must provide competed as true or false" });
    return;
  }

  try {
    const newUser = await taskData.create(
      userInfo.title,
      userInfo.description,
      userInfo.hoursEstimated,
      userInfo.completed
    );
    res.json(newUser);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.put("/tasks/:id", async (req, res) => {
  const taskInfo = req.body;
  try {
    await taskData.getTaskById(req.params.id);
  } catch (e) {
    res.status(404).json({error: "Task not found"});
    return;
  }
  try {
    const updatedTask = await taskData.updateTask(req.params.id, taskInfo);
    res.json(updatedTask);
  } catch (e) {
    console.log(e)
    res.sendStatus(400);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const data = await taskData.remove(req.params.id);
    data.comments = await commentData.removeAuthor(req.params.id);
    // const data = {
    //   oldUser,
    //   allComments
    // }
    const returnObj = {
      "deleted": true,
      data
    }
    res.json(returnObj);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.patch("/:id", async (req, res) => {
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const data = await taskData.remove(req.params.id);
    data.comments = await commentData.removeAuthor(req.params.id);
    // const data = {
    //   oldUser,
    //   allComments
    // }
    const returnObj = {
      "deleted": true,
      data
    }
    res.json(returnObj);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.patch("/:id/comments", async (req, res) => {
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const data = await taskData.remove(req.params.id);
    data.comments = await commentData.removeAuthor(req.params.id);
    // const data = {
    //   oldUser,
    //   allComments
    // }
    const returnObj = {
      "deleted": true,
      data
    }
    res.json(returnObj);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});

router.delete("/:taskId/:commentId", async (req, res) => {
  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    const data = await taskData.remove(req.params.id);
    data.comments = await commentData.removeAuthor(req.params.id);
    // const data = {
    //   oldUser,
    //   allComments
    // }
    const returnObj = {
      "deleted": true,
      data
    }
    res.json(returnObj);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
});




module.exports = router;