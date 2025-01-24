const express = require("express");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async function (req, res) {
  const account = await Account.findOne({
    userId: req.userId
  });
  res.json({
    balance: account.balance
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  console.log(req.body);
  
  
  const account = await Account.findOne({
    userId: new mongoose.Types.ObjectId(req.userId),
  }).session(session);

  // if(!account){
  //   console.log("sorry not found");
  // }

 

  if (account.balance < amount) {
    await session.abortTransaction();
    return res.status(411).json({
      msg: "Insufficient Balance",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(411).json({
      msg: "Invalid Account",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  await session.commitTransaction();

  res.json({
    msg: "Transfer Successfull",
  });
});



module.exports = router;
