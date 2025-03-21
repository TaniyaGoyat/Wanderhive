const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js"); 
const mongoose=require('mongoose');
const {isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController= require("../controllers/reviews.js");

// add review route
router.post("/", isLoggedIn, reviewController.createReview);
  
  //delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.deleteReview);

  module.exports=router;