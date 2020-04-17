const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const env = require('./.env');
const session = require('express-session');
const Bearer = require('passport-http-bearer');
const axios = require('axios');



const app = express();

let user = null;

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
    state: true,
},
    function(accessToken, refreshToken, profile, done) {
        const accessString = 'Bearer ' + accessToken;
        axios.get('https://osu.ppy.sh/api/v2/me', {
            headers: {
                'Authorization': accessString,
            }
        })
            .then( (response) => {
                const data = response.data;
                console.log(data);
                user = response.data
                done(null, {
                    user: data.username,
                    data: data.data,
                });
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
    passport.authenticate('osu-provider', { successRedirect: '/logged', 
                                            failureRedirect: '/failed-login' })
);

app.get('/logged',
    function(req, res) {
        console.log("at login/callback!");
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAarequest:");
        // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBesult:");
        // console.log(res._passport);
        res.send('<span style="white-space: pre-wrap">'+JSON.stringify(user, '<br>', 4)+'</span>');
    }
)

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
