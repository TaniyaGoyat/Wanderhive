const Listing= require("../models/listing.js");

module.exports.index= async(req,res)=>{
    const allListings=await Listing.find();
    res.render("./listings/index.ejs",{allListings});
  }


  module.exports.renderNewForm =(req,res)=>{
    res.render("./listings/new.ejs");
  }


  module.exports.showListing=async(req,res)=>{
      let {id}=req.params;
      const listdata=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
      if(!listdata){
          req.flash("error","Requested Listing doesn't exist");
          return res.redirect("/listings");                      // check can be wrong
      }
      // console.log(listdata);
      res.render("./listings/show.ejs",{listdata});
  }
  

  module.exports.createListing=async (req,res,next)=>{
     let url=req.file.path;
     let filename=req.file.filename;
     console.log(url);
     console.log(filename);
          const newlist= new Listing(req.body.listing);
           newlist.owner=req.user._id;
           newlist.image={url,filename};
           await newlist.save();
           req.flash("success", "New listing created");
          res.redirect("/listings");
  }


  module.exports.renderEditForm=async(req,res)=>{
      const {id}=req.params;
      const listing= await Listing.findById(id);
      if(!listing){
          req.flash("error","Requested Listing doesn't exist");
           return res.redirect("/listings");                                       // cehck can be wrong
      }

    let originalImageUrl=listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_20,w_20")
   res.render("./listings/edit.ejs",{listing,originalImageUrl});
  // res.send("edit page");
  // console.log(listing);
  }


  module.exports.updateListing=async(req,res)=>{

      if(!req.body.listing){
          throw new ExpressError(400,"Send valid data for listing");
       }
       const {id}=req.params;
       const newdata=req.body.listing;
       let updatedListing=await Listing.findByIdAndUpdate(id,{...newdata});
  if(typeof req.file !="undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       updatedListing.image={url,filename};
       await updatedListing.save();
  }
      req.flash("success", "Listing updated");
      res.redirect(`/listings/${id}`);
  }
  

  module.exports.deleteListing=async (req,res)=>{
      const {id}=req.params;
      console.log(id);
      let deletedList=await Listing.findByIdAndDelete(id);
      console.log(deletedList);
      req.flash("success","Listing Deleted");
      res.redirect("/listings");
      // res.send("")
  }

  module.exports.sortListings = async (req, res) => {
    try {
        const { cat } = req.query;
        console.log(cat);
        const allListings = await Listing.find({ category: cat }); // Fixed query syntax

        res.render("./listings/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Server Error");
    }
};







