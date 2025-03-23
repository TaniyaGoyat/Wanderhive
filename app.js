if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require("./models/listing.js");     //requiring model
const path=require("path");
const ejsMate= require("ejs-mate");
// const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expressError.js");
// const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");                 // Router object for listings
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");             // requiring Userschema
const userRouter= require("./routes/user.js");              //requiring UserRoutes
const MongoStore = require('connect-mongo');


//to use ejsMate
app.engine('ejs', ejsMate);

//for method-override
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

// lines for views folder

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));


 //to parse the data of post request-
 app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data

const dburl=process.env.ATLASDB_URL;


// to use sessions**************************************//
const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600
  })

  store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
  })

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()*7*24* 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}



app.use(session(sessionOptions));

app.use(flash());

//*************************CODE for authentication using passport ******************************** */

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//*************************************************************************************************** */

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
    next();
})


//******************************************************** */

//Database connection
// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dburl);       // check
}

//to use the express router
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.get("/privacy",(req,res)=>{
    res.render("privacy.ejs");
})

app.get("/terms",(req,res)=>{
    res.render("terms.ejs");
})


//routes in routes/listing.js


//*******************************Routes for Reviews****************************************-

// routes in /routes/review.js

//************************************************************************************** */



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
})





app.use((err,req,res,next)=>{
   let {statusCode=500,message="Something went wrong"}=err;
//    res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
})


app.listen(8080,(req,res)=>{
    console.log(`App is listening to port 8080`);
})


//lPKCemoBUKFrfUXN
//nakulgoyat2018

//mongodb+srv://nakulgoyat2018:<db_password>@cluster0.xi5pr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://nakulgoyat2018:<lPKCemoBUKFrfUXN>@cluster0.xi5pr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0