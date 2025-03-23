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
    
     const newlist = new Listing({
        ...req.body.listing, // Spread existing listing data
        category: req.body.category // Manually assign category
    });
          console.log(newlist);
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
        console.log(allListings);

        res.render("./listings/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Server Error");
    }
};
//   module.exports.searchListing = async (req, res) => {
//     try {
//         const {search} = req.query;
//         console.log(search);
//         const listdata=await Listing.findOne({title:search}).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
//         console.log(listdata);

//         res.render("./listings/show.ejs", { listdata });
//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         res.status(500).send("Server Error");
//     }
    
// };

module.exports.searchListing = async (req, res) => {
    try {
        const { search } = req.query;
        console.log("Search Query:", search);

        // Handle case where search is empty
        if (!search || search.trim() === "") {
            req.flash("error", "Please enter a search term");
            return res.redirect("/listings");
        }

        // Case-insensitive, partial match search
        const listdata = await Listing.findOne({
            title: { $regex: new RegExp(search, "i") }
        }).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

        // console.log("Found Listing:", listdata);

        if (!listdata) {
            req.flash("error", "No listing found");
            return res.redirect("/listings"); // Redirect if no results found
        }

        res.render("./listings/show.ejs", { listdata });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Server Error");
    }
};









