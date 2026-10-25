const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user.js");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("books", {
      title: 1,
      author: 1,
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("books", {
      title: 1,
      author: 1,
    });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    const user = await User.create({
      username,
      name,
      passwordHash,
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
