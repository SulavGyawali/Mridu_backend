const bodyParser = require("body-parser");
const connectToMongo = require("./db");
const express = require("express");

connectToMongo();

const app = express();
const port = 9000;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/book", require("./routes/book"));
app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Mridu listening to port ${port}`);
});
