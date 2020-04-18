const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const env = require('./.env');
const session = require('express-session');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let users = null;

client.connect(err => {
    if (err) {
        console.log('Could not connect to mongoDB:', 'err');
    }
    users = client.db("gosuAuth").collection("users");
});


const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: env.SESSION_SECRET,
                  resave: false,
                  saveUninitialized: false,})
);


passport.use('osu-provider', new OAuth2Strategy({
    authorizationURL: 'https://osu.ppy.sh/oauth/authorize',
    tokenURL: 'https://osu.ppy.sh/oauth/token',
    clientID: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/login/callback',
    scope: 'identify',
    state: true,
},
    function(accessToken, refreshToken, profile, done) {
        const accessString = 'Bearer ' + accessToken;
        axios.get('https://osu.ppy.sh/api/v2/me', {
            headers: {
                'Authorization': accessString,
            },
            data: {
                'limit': 20,
            }
        })
            .then( (response) => {
                const data = response.data;
                console.log(data);
                users.findOneAndUpdate(
                    { _id: data.username },
                    {  $set: { token: accessToken } },
                    { 
                        new: true,   // return new doc if one is upserted
                        upsert: true // insert the document if it does not exist 
                    }
                    , (err, doc) => done(err, doc));
            })
            .catch( (error) => {
                console.log('ERROR!');
                console.log(error);
                done(error, null);
            })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


app.use('/', express.static('../client/dist'))



app.get('/login',
    passport.authenticate('osu-provider'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        console.log("back to login!");
        console.log(req);
    });

app.get('/login/callback',
    passport.authenticate('osu-provider', { failureRedirect: '/failed-login' }),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send('<span style="white-space: pre-wrap">'+JSON.stringify(req.user, '<br>', 4)+'</span>');
    });

app.get('/logged',
    function(req, res) {
        res.send('<a href="/api/me"> click here! </a>');
    }
)

app.get('/api/me',
    passport.authenticate('osu-provider'),
    function(req, res) {
        console.log("at login/callback!");
        res.json(req.user);
    });

// app.get('/me',
//     passport.authenticate('bearer'),
//     function(req, res) {
//         console.log("at login/callback!");
//         // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBesult:");
//         // console.log(res._passport);
//         res.send('<span style="white-space: pre-wrap">'+JSON.stringify(req.user, '<br>', 4)+'</span>');
//     }
// )

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
