// @desc to follow the advertisement 
//@url POST api/v1/advertisement/follow
//@access Private 

const asynchandler = require("../../middleware/asynchandler");
const client = require("../../utils/database");
const ErrorHandler = require("../../utils/errorhandler");

exports.followAds = asynchandler(async (req,res,next)=>{
    try{
       const data = await client.advertisement.update({
        where:{id:req.body.id},
        data:{
            followers:{
                connect:{
                    id:req.user.id
                }
            }
        }
       })
       if(!data) return next(new ErrorHandler("unable to do the follow function",500))
       
       res.status(200).json({
        status:true,
        following:true
        })
    }catch(err){return next(new ErrorHandler(err.message,500))}
})