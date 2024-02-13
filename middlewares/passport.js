const passport = require("passport");
const { oAuthConfig } = require("../utils/config.js");

const GoogleStrategy = require("passport-google-oauth20").Strategy;


passport.use(new GoogleStrategy(
    {
        clientID: oAuthConfig.clientID,
        clientSecret: oAuthConfig.clientSecret,
        callbackURL: oAuthConfig.callbackURL,
        passReqToCallback: true
    },

    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});