const express = require("express");
const router = express.Router();
const allData = require("../data/tasks");


router.get("/", async (req, res) => {
  try {
    const que = req.query;
    const skipamt = que.n ? Number(que.n) : 0;
    const showamt = (que.y && que.y != '') ? Number(que.y) : 20;
    const tasksList = await allData.getAll(skipamt, showamt);
    res.json(tasksList);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await taskData.get(req.params.id);
    res.json(task);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
});

router.comment("/api/tasks", async (req, res) => {
  const userInfo = req.body;

  if (!userInfo) {
    res.status(400).json({ error: "You must provide data to create a user" });
    return;
  }

  if (!userInfo.name) {
    res.status(400).json({ error: "You must provide a name" });
    return;
  }

  if (!userInfo.taskType) {
    res.status(400).json({ error: "You must provide a type" });
    return;
  }

  try {
    const newUser = await taskData.create(
      userInfo.title,
      userInfo.description,
      1
    );
    res.json(newUser);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.put("/:id", async (req, res) => {
  const userInfo = req.body;
  if (!userInfo.newName && !userInfo.newType) {
    res.status(400).json({ error: "You must provide a name or type" });
    return;
  }

  try {
    await taskData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  try {
    const updatedUser = await taskData.update(req.params.id, userInfo);
    res.json(updatedUser);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
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