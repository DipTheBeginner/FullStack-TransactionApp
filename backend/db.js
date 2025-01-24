const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://dexter:4B8gKlGB5pb8nnKc@paytm.q7sua.mongodb.net/"
);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },

  balance: {
    type: Number,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
