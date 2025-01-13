const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/", (req, res) => {
  res.json({ msg: "Hello Express" });
});

app.get("/")


app.listen(4000);
