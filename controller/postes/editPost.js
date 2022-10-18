// to edit the post 

const asynchandler = require("../../middleware/asynchandler");
const client = require("../../utils/database");
const ErrorHandler = require("../../utils/errorhandler");

//@desc To edit the post by the user 
//@url PATCH api/v1/post/
//@access Private

exports.editPost = asynchandler( async (req,res,next)=>{
    try {

        const data = await client.posts.updateMany({
            where:{
                id:req.body?.postid,
                profileid:req.user.id
            },
            data:{
                description:req.body?.description,
                title:req.body?.title,
                
            }
        })
        if(req.body.data){
            for await (let image of req.body.data){
                await client.postData.upsert({
                    where:{
                        data:image,

                    },
                    update:{
                        post:{
                            connect:{
                                id:req.body.postid
                            }
                        }
                    },
                    create:{
                        data:image ,
                        post:{
                            connect:{
                                id:req.body.postid
                            }
                        }

                    }
                })
            }
        }
        if(!data) return next(new ErrorHandler("update failed",500))
        res.status(200).json({
            status:true,
            data
        })
    } catch (err) {
        return next(new ErrorHandler(err.message,500))
    }  
})