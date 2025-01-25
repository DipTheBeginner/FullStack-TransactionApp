const cors = require("cors");

const express = require("express");
const mainRouter = require("./routes/index");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3000);
