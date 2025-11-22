const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger.json'); 
const db = require('./config');
const routes = require('./routes');
require('dotenv').config();
// NEW: Import the User model to access the MongoDB collection
const User = require('./models/user'); 

const PORT = process.env.PORT || 8080;

// ===========================================
// NEW SESSION CONFIGURATION BLOCK
// ===========================================

// 1. Configure the MongoDB Session Store
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'YOUR_LOCAL_MONGODB_URI_FALLBACK', 
    collection: 'sessions', // Mongoose will create this new collection for session data
});

// Catch errors during session storage connection
store.on('error', function(error) {
    console.error('Session Store Error:', error);
});


// Config
app.use(express.json());

// 2. Updated Session Middleware
app.use(session({
    store: store, 
    secret: process.env.SESSION_SECRET || "a_long_random_fallback_secret", 
    resave: false, 
    saveUninitialized: true
}));
// ===========================================
// END NEW SESSION CONFIGURATION BLOCK
// ===========================================


// This is the basic express session({..}) initialization.
app.use(passport.initialize());
// init passport on every route call.
app.use(passport.session());

// Allow passport to use "express-session"
passport.use(new GitHubStrategy({
// ... (rest of your Passport strategy remains the same)
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    
    // 1. Extract necessary data from the GitHub profile
    const githubId = profile.id;
    const username = profile.displayName || profile.username || 'GitHub User';
    
    // FIX: Safely assign an email. Use the ID as a placeholder email 
    // if the email is not returned from GitHub. This satisfies the 'required' rule.
    const email = profile.emails && profile.emails.length > 0 
                  ? profile.emails[0].value 
                  : `${githubId}@private.github.user`; // <-- CHANGED HERE

    try {
      // 2. Search your MongoDB for a user with this GitHub ID
      let user = await User.findOne({ githubId: githubId });

      if (user) {
        // User found in DB, log them in
        return done(null, user); 
      } else {
        // User not found, create a new User entry
        const newUser = await User.create({
          githubId: githubId,
          username: username,
          email: email, // This now contains the placeholder if needed
          role: 'user'
        });
        return done(null, newUser);
      }
    } catch (err) {
      // Handle database or Mongoose errors
      // The original error you saw will now be caught here.
      console.error('Database error during OAuth:', err);
      return done(err, null);
    }
  }
)); // End of passport.use

passport.serializeUser((user, done) => {
    // When storing the user in the session, we use the user object retrieved from DB
    done(null, user);
});
passport.deserializeUser((user, done) => {
    // When retrieving from session, we pass the user object back
    done(null, user);
});

app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));
app.use(cors({ origin: '*'}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', routes);

// Start the server
db.initDb((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});