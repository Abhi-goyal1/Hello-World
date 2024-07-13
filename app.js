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
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash:true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome To Hello World !");
    // req.flash("success", "Welcome Back" , User.username);
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



app.get("/privacy-policy", (req, res, next) => {
  res.render("includes/privacy-policy",{ active: "" } )
});

app.get("/quizzes", (req, res, next) => {
res.render("quizzes/quiz",{ active: "" } )
});
app.get("/resume-builder", (req, res, next) => {
res.render("resume-builder/resume-builder",{ active: "" } )
});


app.get("/faq", (req, res, next) => {
res.render("includes/faq",{ active: "" } )
});


app.get('/quizzes-content', (req, res , next) => {
    const category = req.query.category;
    if (!category) {
        return res.status(400).send('Category is required');
    }
    res.render('quizzes/quiz-content', { category , active: "" } );
});


app.get("/courses/graphic-design", (req, res) => {
  // res.render("includes/courses", { active: "courses" });
  if(!req.isAuthenticated()){
    req.flash("error", "You must be logged in for Explore courses!")
    return res.redirect("/login")
  }
  // res.send("This is graphic designing course");
  res.render('courses/courses-category/graphic-design', { active: "" });

});


// ! Google Authentication 

const googleStrategy = require("passport-google-oauth20")
passport.use(new googleStrategy(
  {
  clientID : process.env.clientID,
  clientSecret : process.env.clientSecret, 
  callbackURL :process.env.callbackURL,
}
,  async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    if (user) {
      // If user already exists, return the user
      return done(null, user);
    } else {
      // If user doesn't exist, create a new user
      const newUser = new User({
        googleId: profile.id,
        username: profile.emails[0].value, // Using email as username in this example
        displayName: profile.displayName,
        email: profile.emails[0].value
      });

      user = await newUser.save();
      return done(null, user);
    }
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
}
))

app.get("/auth/google", passport.authenticate("google",{
scope: ["profile","email"]
}))

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/signup' }),
  (req, res) => {
    req.flash("success", "Welcome To Hello World !");
    res.redirect('/'); // Redirect after successful authentication
  }
);

// !linkedin authentication-----------------------

// const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_KEY,
//   clientSecret: process.env.LINKEDIN_SECRET,
//   callbackURL: process.env.LINKEDIN_CALLBACK_URL,
//   scope: ['profile', 'email', 'w_member_social'],
//   state: true,
  
// },async function(accessToken, refreshToken, profile, done) {
 
//   try {
//     console.log('AccessToken:', accessToken);
//     console.log('RefreshToken:', refreshToken);
//     console.log('Profile:', profile);

//     let user = await User.findOne({ linkedinId: profile.id });
//     if (user) {
//       // If user already exists, return the user
//       return done(null, user);
//     } else {
//       // If user doesn't exist, create a new user
//       const newUser = new User({
//         linkedinId: profile.id,
//         username: profile.emails[0].value, // Using email as username in this example
//         displayName: profile.displayName,
//         email: profile.emails[0].value
//       });

//       user = await newUser.save();
//       console.log('New user created and saved:', user);
//       return done(null, user);
//     }
//   } catch (err) {
//     console.error('LinkedIn Strategy Error:', err);
//     return done(err);
//   }
 
// }));

// app.get('/auth/linkedin',
//   passport.authenticate('linkedin', { state: 'SOME STATE' })
// );

// app.get('/auth/linkedin/callback',
//   (req, res, next) => {
//     passport.authenticate('linkedin', (err, user, info) => {
//       if (err) {
//         console.error('Authentication Error:', err);
//         return res.redirect('/');
//       }
//       if (!user) {
//         console.error('User not found:', info);
//         return res.redirect('/');
//       }
//       req.logIn(user, (err) => {
//         if (err) {
//           console.error('Login Error:', err);
//           return res.redirect('/');
//         }
//         return res.redirect('/');
//       });
//     })(req, res, next);
//   }
// );



//! ---------------------------------Category routes-------------------------------------

const questionsData = {
  python: [
      { question: "What is Python?", answer: "Python is a high-level, interpreted programming language." },
      { question: "What is a list in Python?", answer: "A list is a collection which is ordered and changeable." }
  ],
  java: [
      { question: "What is Java?", answer: "Java is a high-level, class-based, object-oriented programming language." },
      { question: "What is a class in Java?", answer: "A class is a blueprint for creating objects." }
  ],
  html: [
      { question: "What is HTML?", answer: "HTML stands for HyperText Markup Language." },
      { question: "What is a tag in HTML?", answer: "A tag is used to create elements in HTML." }
  ],
  css: [
      { question: "What is CSS?", answer: "CSS stands for Cascading Style Sheets." },
      { question: "What is a class selector in CSS?", answer: "A class selector selects elements with a specific class attribute." }
  ]
};


// const questions = {
//   python: [
//       {
//           text: 'What is the output of the following code?',
//           code: 'def add(a, b):\n    return a + b\n\nprint(add(1, 2))',
//           answer: '3'
//       },
//       {
//           text: 'What is the output of the following code?',
//           code: 'def add(a, b):\n    return a + b\n\nprint(add(1, 2))',
//           answer: '3'
//       },
//       {
//           text: 'What is the output of the following code?',
//           code: 'def add(a, b):\n    return a + b\n\nprint(add(1, 2))',
//           answer: '3'
//       }
//       // Add more Python questions here
//   ],
//   java: [
//       {
//           text: 'What does the following Java code output?',
//           code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
//           answer: 'Hello, World!'
//       }
//       // Add more Java questions here
//   ],
//   html: [
//       {
//           text: 'What does the following HTML code do?',
//           code: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <h1>This is a Heading</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>',
//           answer: 'It displays a heading and a paragraph.'
//       }
//       // Add more HTML questions here
//   ],
//   css: [
//       {
//           text: 'What does the following CSS code do?',
//           code: 'body {\n    background-color: lightblue;\n}',
//           answer: 'It sets the background color of the body to light blue.'
//       }
//       // Add more CSS questions here
//   ]
// };

// app.get('/category/:name', (req, res) => {
//   const category = req.params.name;
//   res.render('practice-question/category', { category, questions: questions[category] || [],  active: ''  });
// });
app.get('/question/:category', (req, res) => {
  const category = req.params.category;
  const questions = questionsData[category] || [];
  res.render('practice-question/category', { category, questions, active: ''   });
});

app.get('/questions', (req, res) => {
 res.render("practice-question/question-category",{ active: "" } );
});

//! ---------------------------------Category routes Ends -------------------------------------



app.get('/roadmap', (req, res) => {
  res.render("roadmaps/roadmap",{ active: "" } );
 });
app.get('/roadmaps/frontend', (req, res) => {
  res.render("roadmaps/frontend",{ active: "" } );
 });
 
app.get('/roadmaps/game-development', (req, res) => {
  res.render("roadmaps/game-dev",{ active: "" } );
 });
 
app.get('/roadmaps/backend', (req, res) => {
  res.render("roadmaps/backend",{ active: "" } );
 });
 
app.get('/roadmaps/android', (req, res) => {
  res.render("roadmaps/android",{ active: "" } );
 });
 
app.get('/roadmaps/java', (req, res) => {
  res.render("roadmaps/java",{ active: "" } );
 });
 
app.get('/roadmaps/devops', (req, res) => {
  res.render("roadmaps/devops",{ active: "" } );
 });
 
app.get('/roadmaps/javascript', (req, res) => {
  res.render("roadmaps/javascript",{ active: "" } );
 });
 
app.get('/roadmaps/full-stack', (req, res) => {
  res.render("roadmaps/fullstack",{ active: "" } );
 });
 

//  app.get('/roadmap/:category', (req, res) => {
//   const category = req.params.category;
  
//   res.render('practice-question/category', { category, questions, active: ''   });
// });









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
