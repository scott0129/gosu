const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
const env = require("./.env");
const session = require("express-session");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
const request = require("request");
const fs = require("fs");

const STATIC_DIR = "../client/dist";

// setup ===========================================================================================

const client = new MongoClient(env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let users = null;
client.connect(err => {
    if (err) {
        console.log("Could not connect to mongoDB:", "err");
    }
    users = client.db("gosuAuth").collection("users");

    startServer();
});

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(attachCookie("/"));
app.use(express.static(STATIC_DIR));

passport.use(
    "osu-provider",
    new OAuth2Strategy(
        {
            authorizationURL: "https://osu.ppy.sh/oauth/authorize",
            tokenURL: "https://osu.ppy.sh/oauth/token",
            clientID: env.CLIENT_ID,
            clientSecret: env.CLIENT_SECRET,
            callbackURL: "http://localhost:4000/login/callback",
            scope: "identify users.read",
            state: true
        },
        function(accessToken, refreshToken, profile, done) {
            fetchUserInfo(accessToken)
                .then(updateDatabase)
                .then(doc => done(null, doc))
                .catch(error => {
                    console.error("ERROR in making API calls!", error);
                    done(error, null);
                });
        }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

function startServer() {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`listening on ${port}`);
    });
}

function attachCookie(url) {
    return function(req, res, next) {
        if (req.url == url && req.session && req.session.user) {
            console.log("attached cookie!");
            console.log(JSON.stringify(req.session.user.value.beatmaps).length);
            res.cookie(
                "beatmaps",
                JSON.stringify(req.session.user.value.beatmaps)
            );
        }
        next();
    };
}

function fetchUserInfo(accessToken) {
    return axios
        .get("https://osu.ppy.sh/api/v2/me", {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
        .then(response => {
            const data = response.data;
            return axios.get(
                `https://osu.ppy.sh/api/v2/users/${data.id}/beatmapsets/most_played`,
                {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    },
                    data: {
                        limit: 10,
                        username: response.data.username // This isn't necessary for the API but we read it when we get the response with JSON.parse
                    }
                }
            );
        });
}

function extractBeatmapsInfo(rawData) {
    console.log(rawData);
    let beatmapsList = rawData.map(({ beatmap_id, beatmap, beatmapset }) => ({
        beatmap_id: beatmap_id,
        version: beatmap.version,
        set_id: beatmapset.id,
        creator: beatmapset.creator,
        title: beatmapset.title,
        artist: beatmapset.artist,
        preview_url: beatmapset.preview_url
    }));
    return beatmapsList;
}

function updateDatabase(apiResponse) {
    let beatmapsList = extractBeatmapsInfo(apiResponse.data);
    let accessToken = apiResponse.config.headers.Authorization.split(" ")[1];

    return users.findOneAndUpdate(
        { _id: JSON.parse(apiResponse.config.data).username },
        {
            $set: {
                token: accessToken,
                beatmaps: beatmapsList
            }
        },
        {
            new: true, // return new doc if one is upserted
            upsert: true // insert the document if it does not exist
        }
    );
}

// Routes ==========================================================================================

app.get("/login", passport.authenticate("osu-provider"), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log("back to login!");
    console.log(req);
});

app.get(
    "/login/callback",
    passport.authenticate("osu-provider", { failureRedirect: "/failed-login" }),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        req.session.user = req.user;

        res.redirect("/");
        // res.set('location', '/logged');
        // res.status(302).json(req.session.user);
        // res.send('<span style="white-space: pre-wrap">'+JSON.stringify(req.user, '<br>', 4)+'</span>');
    }
);

app.get("/logged", function(req, res) {
    res.send('<a href="/api/me"> click here! </a>');
});

/* Forward the data from the beatmap API back to client. 'request' is deprecated as of Feburary 2020
 * but there are no alternatives that will let us pipe without putting data into disk/memory
 */
app.get("/b/:setId", async function(req, res) {
    const setId = req.params.setId;
    const localPath = `./beatmap-${setId}.osz`;

    if (!fs.existsSync(localPath)) {
        console.log("Downloading from API");
        const localCache = fs.createWriteStream(localPath);
        await request(`https://bloodcat.com/osu/s/${setId}`)
            .on("data", function(data) {
                localCache.write(data);
            })
            .on("end", () => localCache.end());
    }
    console.log("Serving local file");
    fs.createReadStream(localPath)
        .on("data", function(data) {
            res.write(data);
            var writeStream = fs.createWriteStream("./output");
        })
        .on("end", function() {
            res.end();
        });
});

// This bottom one should be used in production so we don't save a crazy amount of files
// app.get('/b/:setId',
//     function(req, res) {
//         const setId = req.params.setId;
//         console.log(req.headers);
//         request(`https://bloodcat.com/osu/s/${setId}`)
//             .on('data', function(data) {
//                 res.write(data);
//             })
//             .on('end', function() {
//                 res.end();
//             })
//     }
// );
