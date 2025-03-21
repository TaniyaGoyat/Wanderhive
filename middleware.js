const Listing= require("./models/listing.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    if (!req.isAuthenticated()) {
        //redirect URL save
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login"); 
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(  req.session.redirectUrl){
        res.locals.redirectUrl=  req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
        const {id}=req.params;
        console.log(id);
         let listing= await Listing.findById(id);
         console.log(listing);
         if(!listing.owner.equals(res.locals.currUser._id)){
             req.flash("error", "You're no the owner of the listing!!");
             return  res.redirect(`/listings/${id}`);
         }
        next(); 
}
module.exports.isReviewAuthor= async(req,res,next)=>{
        const {id,reviewId}=req.params;
        console.log(reviewId);
         let review= await Review.findById(reviewId);
         console.log(review);
         if(!review.author.equals(res.locals.currUser._id)){
             req.flash("error", "You're no the author of this review!!");
             return  res.redirect(`/listings/${id}`);
         }
        next(); 
}
