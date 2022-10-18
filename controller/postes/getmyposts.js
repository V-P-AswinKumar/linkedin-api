const asynchandler = require("../../middleware/asynchandler")
const client = require("../../utils/database")
const ErrorResponse = require("../../utils/errorhandler")


//@desc     To get the post
//@url      GET /api/v1/post/my    
//@access   Private
exports.getMyPosts = asynchandler( async (req,res,next) => {
    const data = await client.posts.findMany({
        where:{
            profileid: req.user.id
        },
        include:{
            data:true,
            _count:{
                select:{
                    likes:true
                }
            },
            userpost:{
                select:{
                    profilepic:true,
                    firstName:true,
                    lastName:true,
                }
            }
            
        }
            
        })
    if(!data) return next(new ErrorResponse("there is no posts",423))
   
    res.status(200).json({
        count: data.length ,
        data
    })
})    