const express=require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const Listing=require("../models/listing.js"); 
const {isLoggedIn,isOwner}= require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer= require("multer");
const {storage}= require("../cloudConfig.js");
const upload = multer({storage });

//All listings Route // Index Route
router.get("/", wrapAsync(listingController.index));

//sort route
router.get("/sort",listingController.sortListings);


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//create route
// router.post("/",wrapAsync(listingController.createListing));
router.post("/",isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing));

//delete route

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));




module.exports=router;
