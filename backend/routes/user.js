const zod = require("zod");
const {User} =require("../db");
const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const {Account}=require("../db")

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const updateBody = zod.object({
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const   router = express.Router();

router.post("/signup", async function (req, res) {
  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ 
      msg: "Invalid input data",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      msg: "Usename is already taken",
    });
  }
  const user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.status(202).json({
    msg: "Congratulations.. User Created Successfully",
    token: token,
  });
});

router.post("/signin", async function (req, res) {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      msg: "Incorrect Inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.status(200).json({
      token: token,
    });
  }

  res.status(411).json({
    msg: "Error.. While logging in",
  });
});

router.put("/", authMiddleware, async function (req, res) {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
     res.status(411).json({
      msg: "Error Updating info Check Again...",
    });
  }
  await User.updateOne(req.body, {
    _id: req.userId,
  });

  res.json({
    msg: "Updated Successfully",
  });
});

router.get("/bulk", async function (req, res) {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
