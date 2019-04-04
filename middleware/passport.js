const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const secret = require('../config/jwtConfig').secret;
const UnsafeUser = require('../models/UnsafeUser');
const authMethodMapping = require('../config/authMethodMapping');

const headerApiKeyOpts = { // Configure how passport identifies the API Key
    header: 'Authorization', 
    prefix: 'Api-Key ',
}

const jwtExtractorOpts = { // Configure how passport extracts and verifies the JWT
    secretOrKey : secret,
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
}

const localStrategyOptions = {
    passReqToCallback: true
}

// Passport Strategies
passport.use(new LocalStrategy(localStrategyOptions,
    async function(req, username, password, done) {
        try{
            let unsafeUser = new UnsafeUser(await UnsafeUser.getUserByUsername(username));
            bcrypt.compare(password, unsafeUser.password, function (err, isMatch){
                if(isMatch) {
                    req.cmapApiCallDetails.authMethod = authMethodMapping.local;
                    req.cmapApiCallDetails.userID = unsafeUser.id;
                    return done(null, unsafeUser.makeSafe());
                }
                return done(null, false);
            })
        } catch (e) {
            return done(null, false);
        }
    }
  ));

passport.use(new JwtStrategy(jwtExtractorOpts,
    function(req, jwtPayload, done){
        req.cmapApiCallDetails.authMethod = authMethodMapping.jwt;
        // This confirms we signed the payload, but we need to identify the user as well
        return done(null, 'Verified signature')
    }
))

passport.use(new HeaderApiKeyStrategy(
    headerApiKeyOpts,
    true,
    async function(apiKey, done, req){
        try {
            let unsafeUser = new UnsafeUser(await UnsafeUser.getUserByApiKey(apiKey));
            req.cmapApiCallDetails.authMethod = authMethodMapping.apiKey;
            req.cmapApiCallDetails.userID = unsafeUser.id;
            req.cmapApiCallDetails.apiKey = apiKey;
            return done(null, unsafeUser.makeSafe());
        } catch (e){
            return done(e, false);
        }
    }        
    ))

module.exports = passport;