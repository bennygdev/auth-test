const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const jwt = require('jsonwebtoken');

require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing user by googleId
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          return done(null, user);
        }

        // Or find by email
        user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (user) {
          // Link account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          username:
            profile.displayName.replace(/\s/g, '') +
            Math.floor(Math.random() * 1000), // Create a unique username because bruh
          email: profile.emails[0].value,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// twitter strat may be coming soon tho