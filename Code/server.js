require("./models/db")
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");

const User = mongoose.model("User");

const app = express();
const PORT = 3000;
const allowed = ["interactive", "home", "notFound", "quiz", "about", "login"];

app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIES_1, process.env.COOKIES_2],
    maxAge: 24 * 60 * 60 * 1000
}));

app.set("views", path.join(__dirname, "/scripts/ejs"));
app.use(express.static(path.join(__dirname, '/scripts')));

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", async (req, res) => {
    res.redirect("/home");
});

app.get("/:id", bodyparser.urlencoded({ extended: true }), async (req, res) => {
    if (allowed.includes(req.params.id)) res.render(req.params.id + ".ejs", {
        loggedIn: req.session.hasOwnProperty("name") && req.session.name != "" && req.session.hasOwnProperty("password") && req.session.password != ""
    });
    else if (req.params.id == "logout") {
        req.session.name = "";
        req.session.password = "";
        res.redirect("home");
    }
    else res.redirect("notFound");
});

app.get("/home", async (req, res) => {
    res.render("home.ejs");
});

app.get("/logout", async (req, res) => {
    req.session.name = "";
    req.session.password = "";
    res.redirect("home");
});

app.post("/login", bodyparser.urlencoded({ extended: true }), async (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let found = false;
    let user = new User();
    User.find({}).then(users => {
        for (let i = 0; i<users.length; i++) {
            let user = users[i];
            if (user.name == name) {
                found = true;
                break;
            }
        }
    }).then(_ => {
        req.session.name = name;
        req.session.password = password;
        if (!found) {
            user.name = name;
            user.password = password;
            user.save();
        }
        res.redirect("home");
    });
});

app.listen(PORT, _ => console.log("Listening on port: " + PORT));