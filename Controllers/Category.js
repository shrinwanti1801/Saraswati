const Category=require('../Models/Category');


// creating a tag
exports.createCategory=async (req,res)=>{
    try{
        //fetch data from req's body
        const {name,description}=req.body;

        //name and description must present
        if(!name || !description)
        {
            return res.status(400).json({
                success:false,
                message:"all feilds are required"
            })
        }

        //create Entry in DB
        const categoryDetails=await Category.create({
            name:name,
            description:description
        });

        return res.status(200).json({
            success:true,
            message:"Category created successFully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while creating category"
        })
    }
}


//get all tags
exports.showAllCategory=async (req,res)=>{
    try{
        const allCategory=await Category.find({},{name:true,description:true});
        
        return res.status(200).json({
            success:true,
            message:"returned all category",
            data:allCategory,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while fetching all category"
        })
    }
}



//Categoty page details
exports.categoryPageDetails=async (req,res)=>{
    try{
        //get CategotyId
        const {categoryId}=req.body;

        if(!categoryId)
        {
            return res.status(400).json({
                success:false,
                message:"CategotyId is missing"
            })
        }

        //get course for this CategotyId
        const selectedCategoty=await Category.findById(categoryId)
        .populate("course")
        .exec();

        //check that does course exist for this CategotyId
        if(!selectedCategoty)
        {
            return res.status(400).json({
                success:false,
                message:"Data not found"
            })
        }

        //get courses for different Categories
        const differentCategories=await Category.find({
            _id:{$ne:categoryId}
        })
        .populate("course")
        .exec();

        //get top selling courses - HW

        //return response
        return res.status(200).json({
            success:true,
            message:"Fetched fata",
            selectedCategoty,
            differentCategories,
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while fetching Categoty data",
        })
    }
}