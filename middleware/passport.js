const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const keyGen = require('uuid-apikey');

const secret = require('../config/jwtConfig').secret;
const UnsafeUser = require('../models/UnsafeUser');

const headerApiKeyOpts = { // Configure how passport identifies the API Key
    header: 'Authorization', 
    prefix: 'Api-Key ' 
}

const jwtExtractorOpts = { // Configure how passport extracts and verifies the JWT
    secretOrKey : secret,
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
}

// Passport Strategies
passport.use(new LocalStrategy( 
    async function(username, password, done) {
        try{
            let unsafeUser = new UnsafeUser(await UnsafeUser.getUserByUsername(username));
            bcrypt.compare(password, unsafeUser.password, function (err, isMatch){
                if(isMatch) return done(null, unsafeUser.makeSafe());
                return done(null, false);
            })
        } catch (e) {
            return done(null, false);
        }
    }
  ));

passport.use(new JwtStrategy(jwtExtractorOpts,
    function(jwtPayload, done){
        return done(null, 'Verified signature')
    }
))

passport.use(new HeaderApiKeyStrategy(
    headerApiKeyOpts,
    false,
    async function(apiKey, done){
        try { // An invalid API Key will will fail to convert and return 401.
            var uuid = keyGen.toUUID(apiKey);
            let unsafeUser = new UnsafeUser(await UnsafeUser.getUserByApiKey(uuid));
            return done(null, unsafeUser.makeSafe());
        } catch (e){
            return done(null, false);
        }
    }        
    ))

//

module.exports = passport;