const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const mongoose=require("mongoose");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    // console.log(newReview.author);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();                // to save the changes in the existing listing
  
    console.log("New Review saved");
   req.flash("success", "New review added")
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deleteReview=async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id, {$pull: { reviews: new mongoose.Types.ObjectId(reviewId) }});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted");
       res.redirect(`/listings/${id}`);
    
    }