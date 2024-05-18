const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require('dotenv').config();

// !Module
const User = require("./models/user");
const Content = require("./models/content");

const bodyParser = require('body-parser');

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

app.use(express.urlencoded({ extended: true }));
const { isLoggedIn } = require("./middleware");

//! Data Base Connection.
const MONGO_URL = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB! ${err}`);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
  
}

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("SESSION STORE ERROR");
});
const sessionOption = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//! Passport Authentication.
const passport = require("passport");
const LocalStrategy = require("passport-local");




// ! Google Authentication 
// passport-setup.js

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // const User = require('./models/User'); // Create a User model

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: '858164119318-t2m3oqtl8uk1mepis54oq8kheo0cmfkq.apps.googleusercontent.com',
//             clientSecret: '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',
//             callbackURL: '/auth/google/callback',
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             // Check if user already exists in the database
//             const existingUser = await User.findOne({ googleId: profile.id });

//             if (existingUser) {
//                 return done(null, existingUser);
//             }

//             // Create a new user
//             const newUser = new User({
//                 googleId: profile.id,
//                 displayName: profile.displayName,
//                 // Add other relevant user details
//             });

//             await newUser.save();
//             done(null, newUser);
//         }
//     )
// );

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//     '/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         // Successful authentication, redirect home
//         res.redirect('/');
//     }
// );
const googleStrategy = require("passport-google-oauth20")
passport.use(new googleStrategy({

  clientID:"858164119318-t2m3oqtl8uk1mepis54oq8kheo0cmfkq.apps.googleusercontent.com",
clientSecret:"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",
callbackURL : "/auth/google/callback",

 


}, (accessToken, refreshToken, profile,done) =>{
console.log(accessToken)
console.log(refreshToken)
console.log(profile)
}))

app.get("/auth/google", passport.authenticate("google",{
scope: ["profile","email"]
}))
app.get("/auth/google/callback", passport.authenticate("google"))


 





app.use(bodyParser.json());
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//! EJS Template.
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/views")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  next();
});

//! Pages Routes.
app.get("/", (req, res) => {
  res.render("../index.ejs", { active: "home" });
});

app.get("/tutorial", (req, res) => {
  res.render("includes/tutorial", { active: "tutorial" });
});

app.get("/courses", (req, res) => {
  res.render("includes/courses", { active: "courses" });
});

app.get("/services", (req, res) => {
  res.render("includes/services", { active: "services" });
});

app.get("/get-certified", (req, res) => {
  res.render("includes/get-certified", { active: "get-certified" });
});
app.get("/contact-us", (req, res) => {
  res.render("includes/contact", { active: "" });
});
app.get("/career", (req, res) => {
  res.render("includes/career", { active: "" });
});
app.get("/career-detail", (req, res) => {
  res.render("includes/careerDetail", { active: "" });
});

//! Tutorial routes.
// Html routes and functionality. 
app.get("/html/html_intro", (req, res) => {
  res.render("tutorials/HTML/html", { active: "" });
});
// css routes and functionality. 
app.get("/css/css_intro", (req, res) => {
  res.render("tutorials/CSS/css", { active: "" });
});
//  javaScript routes and functionality. 
app.get("/js/js_intro", (req, res) => {
  res.render("tutorials/JAVASCRIPT/js", { active: "" });
});
//  Bootstrap routes and functionality. 
app.get("/bootstrap/bootstrap_intro", (req, res) => {
  res.render("tutorials/BOOTSTRAP/bootstrap", { active: "" });
});
//  tailwind routes and functionality. 
app.get("/tailwind/tailwind_intro", (req, res) => {
  res.render("tutorials/TAILWIND/tailwind", { active: "" });
});
//  Nodejs routes and functionality. 
app.get("/nodejs/nodejs_intro", (req, res) => {
  res.render("tutorials/NODEJS/nodejs", { active: "" });
});
//  React routes and functionality. 
app.get("/react/react_intro", (req, res) => {
  res.render("tutorials/REACT/react", { active: "" });
});
//  C routes and functionality. 
app.get("/c/c_intro", (req, res) => {
  res.render("tutorials/C/c", { active: "" });
});
//  JAVA routes and functionality. 
app.get("/java/java_intro", (req, res) => {
  res.render("tutorials/JAVA/java", { active: "" });
});
//  Python routes and functionality. 
app.get("/python/python_intro", (req, res) => {
  res.render("tutorials/PYTHON/python", { active: "" });
});
//  Sql routes and functionality. 
app.get("/sql/sql_intro", (req, res) => {
  res.render("tutorials/SQL/sql", { active: "" });
});

//! Signup Route and functionality.
app.get("/signup", async (req, res) => {
  res.render("users/signup", { active: "" });
});
app.get("/user/signup", async (req, res) => {
  res.render("users/signup-form", { active: "" });
});
app.post("/user/signup", wrapAsync (async (req, res) => {
 try {
  let { username, email, password } = req.body;
  
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  
req.login(registeredUser, (err)=>{
  if(err){
    return next(err);
  }
  req.flash("success","Welcome to Hello World!")
res.redirect("/");
})

 } catch (error) {
  req.flash("error", error.message);
  res.redirect("/user/signup");
 }
}));

//! login Route and functionality.
app.get("/login", async (req, res) => {
  res.render("users/login.ejs", { active: "" });
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash:true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome To Hello World !");
    res.redirect("/");
  }
);

//! logout Route and functionality.
app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Successfully Logout !");
    res.redirect("/");
  });
});


// Set up routes
// app.get('/api/tab/:tabId', async (req, res) => {
//   try {
//     const { tabId } = req.params;
//     const tabContent = await TabContent.findOne({ tabId });

//     if (tabContent) {
//       res.json({ content: tabContent.content });
//     } else {
//       res.status(404).json({ message: 'Tab content not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// Render the EJS template
// app.get('/html', (req, res) => {
//   res.render('content/html.ejs', { active: "" });
// });


app.get("/courses/graphic-design", (req, res) => {
  // res.render("includes/courses", { active: "courses" });
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in for Explore courses!")
    return res.redirect("/login")
  }
  res.send("This is graphic designing course");
});






//! Route for undefine.
app.all("*", (req, res, next) => {
  res.render("/error", { err: new ExpressError(404, "Page Not Found"), active: '' });
 
});

//! Error Handling.
// app.use((err, req, res, next)=>{
//   let {statusCode = 500 , message = "Something Went Wrong!"} = err;
//  res.status(statusCode).render("includes/error", { err , active: ''},)
// });

//! Server Port
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
