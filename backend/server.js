const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, "your_jwt_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const reportSchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
  content: String,
});

const Report = mongoose.model("Report", reportSchema);

app.post("/api/reports", (req, res) => {
  const { name, address, phoneNumber, content } = req.body;
  const report = new Report({ name, address, phoneNumber, content });
  report
    .save()
    .then(() => res.status(201).json({ message: "Report created" }))
    .catch((error) => res.status(500).json({ error }));
});

app.get("/api/reports", (req, res) => {
  Report.find()
    .then((reports) => res.json(reports))
    .catch((error) => res.status(500).json({ error }));
});

mongoose
  .connect("mongodb://localhost:27017/mern-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => console.error("Database connection error:", error));
