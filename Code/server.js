require("./models/db")
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = mongoose.model("User");

const app = express();
const PORT = 3000;
const allowed = ["interactive", "home", "notFound", "quiz", "about", "login"];
const previousChats = {};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction:"You are an AI helper built into a website of a team called H-Exo-Plorers. Our team has signed up for the NASA organised hackathon which is split up among different countries and we are taking part in the hackathon in the area of Venice, Italy, which takes place in H-Farm during the weekend of the 5th and 6th of October. Our team has selected to built a website which will contain an interactive tool where you can move around space and interact with exoplanets. You are a chatbot which will give answers about the exoplanets based on the questions that the user will ask. The info you are given is the following: "+`
There are 4 main types of exoplanets and those are:
Gas Giants: Planets composed mainly of hydrogen, helium and other gasses. They are the size of Saturn or Jupiter (~42.7 billion km²) or more.

Neptune-Like: Similar in size to Neptune or Uranus (~7.618 billion km²). They have different mixtures of interior compositions, but all present a hydrogen and helium-dominated outer atmosphere and a rocky core.  

Terrestrial: Earth-sized (~510.1 million km²) or smaller. Mainly composed of rock, silicate, water and carbon.

Super-Earth: Typically terrestrial planets. Much bigger than Earth, but lighter than Neptune.

The names of the exoplanets depend on the name of their parent star.

Technnical aspects of the planets can be described by using the following:
Semi-Major Axis: Distance from the centre of an ellipse to the farthest point on the perimeter of the ellipse
Eccentricity: Measure of how non-circular the orbit of a body is. The value is between 0 and 1 otherwise it will give a parabola and hyperbole as a shape. The eccentricity is derived from conic cones.
Spectral Type: Shortcode primarily summarizing the ionization state, giving an objective measure of the temperature
Luminosity: Amount of light reflected from the planet


Exoplanets currently featured in the websiter:

Kepler-452b:
Discovery Date: July 23, 2015
Distance from Earth: ~1,400 light-years
Type: Super-Earth
Radius: 1.63 times that of Earth
Composition: 82% nitrogen, 14% Oxygen, 2% Carbon Dioxide, 2% trace element
Mass: Estimated at about 3.29 Earth masses (1.964×1022 tons)
Diameter: 60% larger than Earth
Orbital Period: 384.8 days (~5% longer than Earth's year)

Kepler-452b is located in the habitable zone of its star, conditions allow for liquid water to exist on its surface.				
Composition similar to Neptune, with a small rocky core surrounded by a thick mantle of ice and gasses.
Kepler-452b was notable for being the first approximately Earth-sized planet found in the habitable zone of a Sun-like star.
The data leading to the discovery of Kepler-452b was collected through the Kepler Space Telescope.
TECHNICAL:
Semi-Major Axis: Approximately 1.046 AU
Eccentricity: 0.0
Distance from Star: 156.5 million km
Spectral Type: G2
Star Age: Approximately 6 billion years
Luminosity: 20% brighter than the Sun


Proxima Centauri b:
Discovery Date: August 24, 2016
Distance from Earth: ~4.24 light years
Type: Terrestrial 
Radius: ~1.07 times that of Earth
Composition: Nitrogen, Oxygen, Carbon Dioxide, Argon, Water
Mass: Estimated to be around 1.17 Earth masses (6.986×1021 tons)
Diameter: ~14% of the Sun's diameter
Orbital Period: 11 days

Proxima Centauri b orbits in the habitable zone of its star, Proxima Centauri, the closest star to the Sun.
Conditions might allow for liquid water to exist on its surface, although the planet is subject to intense stellar flares and radiation due to its proximity to its star.

TECHNICAL:
Semi-Major Axis: Approximately 0.0485 AU
Eccentricity: 0.0
Distance from Star: ~7.5 million km
Spectral Type: M5.5 (Red Dwarf)
Star Age: Approximately 4.85 billion years
Luminosity: 0.15% of the Sun's luminosity


55 Cancri e:
Discovery Date: August 30, 2004
Distance from Earth: ~41 light-years
Type: Super-Earth
Radius: 1.875 times that of Earth
Composition: Carbon, Silicon, Hydrogen, Diamond, Graphite, Hydrogen
Mass: Estimated at about 8.08 Earth masses (4.82×10²⁴ tons)
Diameter: 80% larger than Earth
Orbital Period: 0.736 days (17.6 hours)

55 Cancri e is located extremely close to its star, with temperatures on the surface exceeding 2,000°C.
There is speculation about volcanic activity or even liquid lava oceans. 

TECHNICAL:
Semi-Major Axis: Approximately 0.0156 AU
Eccentricity: ~0.03 (mildly eccentric orbit)
Distance from Star: ~2.2 million km
Spectral Type: K0
Star Age: Approximately 8 billion years
Luminosity: About 40% of the Sun's luminosity


HD 189733 b:
Discovery Date: October 5, 2005
Distance from Earth: ~64.5 light-years
Type: Gas Giant
Radius: 12.7 times that of Earth 
Composition: hydrogen, helium, methane, water, silicate
Mass: ~370 Earth masses (~2.21 × 10²⁷ tons)
Diameter: ~142,000 km (about 11 times Earth's diameter)
Orbital Period: 2.22 days

HD 189733 b is located extremely close to its star, which leads to scorching temperatures and violent atmospheric conditions.
It is known for its deep blue color, likely caused by silicate particles that condense in its atmosphere, causing high-speed winds and storms.
TECHNICAL:
Semi-Major Axis: ~0.03142 AU
Eccentricity: ~0.004 (nearly circular orbit)
Distance from Star: ~4.7 million km
Spectral Type: K1.5
Star Age: Approximately 6 billion years
Luminosity: About 25% of the Sun's luminosity


Wasp 12b:
Discovery Date: April 1, 2008
Distance from Earth: ~1,410 light-years
Type: Gas Giant
Radius: ~21.4 times that of Earth's
Composition:  hydrogen, helium, carbon, carbon monoxide, methane
Mass: ~448 Earth masses (~2.68 × 10²⁷ tons)
Diameter: ~227,000 km (about 18 times Earth's diameter)
Orbital Period: 1.09 days

WASP-12b is one of the most extreme exoplanets that we know of, orbiting extremely close to its host star, which causes it to experience immense tidal forces. These forces are so strong that the planet is being deformed and is losing material to its star, giving it an elongated, football-like shape.
It is also one of the darkest exoplanets discovered, reflecting very little light from its star.

TECHNICAL:
Semi-Major Axis: ~0.0234 AU
Eccentricity: ~0.049 (slightly eccentric orbit)
Distance from Star: ~3.5 million km
Spectral Type: G0
Star Age: Approximately 3 billion years
Luminosity: ~1.4% that of the Sun


Kepler-186f:
Discovery Date: April 17, 2014
Distance from Earth: ~580 light-years
Type: Terrestrial
Radius: 1.11 times that of Earth
Composition: Silicates, metals (composition similar to Earth)
Mass: 1.32 Earth masses (~7.88 × 10²⁴ tons)
Diameter: ~12% larger than Earth (~14,300 km)
Orbital Period: 129.9 days

While little is known about its atmosphere, its location in the habitable zone makes it a candidate for potentially supporting life.
TECHNICAL:
Semi-Major Axis: ~0.356 AU
Eccentricity: Uknown
Distance from Star: ~53.6 million km
Spectral Type: M1 (Red Dwarf)
Star Age: Approximately 4 billion years
Luminosity: About 4% of the Sun’s luminosity




`});

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

app.get("/:id", express.urlencoded({ extended: true }), async (req, res) => {
    if (allowed.includes(req.params.id)) res.render(req.params.id + ".ejs", {
        loggedIn: isLoggedIn(req),
        chats: (isLoggedIn(req) ? JSON.stringify(previousChats[req.session.name]) : "")
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

app.post("/login", express.urlencoded({ extended: true }), async (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let found = 0; // 0=not found, 1=wrong password, 2=login
    let user = new User();
    User.find({}).then(users => {
        for (let i = 0; i<users.length; i++) {
            let user = users[i];
            if (user.name == name) {
                if (user.password == password) found = 2;
                else found = 1
                break;
            }
        }
    }).then(_ => {
        if (found != 1) {
            req.session.name = name;
            req.session.password = password;
            if (found == 0) {
                user.name = name;
                user.password = password;
                user.save();
            }
            res.redirect("home");
        }
        else {
            res.redirect("login")
        }
    });
});

app.post("/chat", express.urlencoded({ extended: true }), async (req, res) => {
    try {
        let user = req.session['name'];
        let prompt = req.body.prompt;
        const chat = model.startChat({
            history: previousChats[user],
            generationConfig: {
                maxOutputTokens: 100,
            }
        });
        const result = await model.generateContent(prompt);
        if (!previousChats.hasOwnProperty(user)) previousChats[user] = [];
        previousChats[user].push({role: 'user', parts: [{text: prompt}]});
        previousChats[user].push({role: 'model', parts: [{text: result.response.text()}]});
    }
    catch (err) {
        console.error("Gemini API error: ", err);
        res.redirect("notFound");
    }
    res.redirect("/");
});

app.listen(PORT, _ => console.log("Listening on port: " + PORT));

function isLoggedIn(req) {
    return req.session.hasOwnProperty("name") && req.session.name != "" && req.session.hasOwnProperty("password") && req.session.password != "";
}