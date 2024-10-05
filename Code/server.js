const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const allowed = ["interactive", "home", "notFound", "quiz", "about"];

app.set("views", path.join(__dirname, "/scripts/ejs"));
app.use(express.static(path.join(__dirname, '/scripts')));

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", async (req, res) => {
    res.redirect("/home");
});

app.get("/:id", (req, res) => {
    if (allowed.includes(req.params.id)) res.render(req.params.id + ".ejs");
    else res.render("notFound.ejs");
});

app.get("/home", async (req, res) => {
    res.render("home.ejs");
});

app.listen(PORT, _ => console.log("Listening on port: " + PORT));