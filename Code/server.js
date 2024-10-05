const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "/scripts"));
app.use(express.static(path.join(__dirname, '/scripts')));

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", async (req, res) => {
    res.redirect("/home");
});

app.get("/home", async (req, res) => {
    res.render("index.ejs");
});

app.listen(PORT, _ => console.log("Listening on port: " + PORT));