const asynchandler = require('../../middleware/asynchandler')
const client = require("../../utils/database")
const ErrorResponse = require("../../utils/errorhandler")

//@decs  Put like the post
//@url   POST api/v1/post/like
//@access Private 


exports.like = asynchandler(async (req,res,next)=>{
   try{
    if(!req.body.postid) return next(new ErrorResponse('postid field required in body',404))
    let like;
    let data; 
    try{ 
      
    data  = await client.like.delete({
        where:{
            postid_userid:{
                userid:req.user.id, 
                postid:req.body.postid,
            }
        },
        
     })
     like = false 
    }catch(error){
     data = await client.like.create({
        data:{
            type:req.body?.type,
            likedby:{
                connect:{ 
                id:req.user.id,
                }
            },
            like:{
                connect:{
                    id:req.body.postid,
                }
            },
        },
    
     })
     like = false; 
    }
    const count  = await client.posts.findFirstOrThrow({
        where:{id:req.body?.postid},
        select:{
            _count:{
                select:{
                    likes:true,
                    comments:true,
                }
            }
            
        }
    })
    const belongto = await client.posts.findFirst({where:{id:req.body.postid},select:{profileid:true}})
    if(!data) return next(new ErrorResponse("unable to perform the requested operation",500))
    await client.activity.create({
        data:{
            useractivity:{
                connect:{
                    id:req.user.id
                }
            },
            type:"post",
            message:"the post is liked",
            targetid:req.body.postid,
            belongsTo:belongto.profileid,
            tagetpic:"https://res.cloudinary.com/dibccigcp/image/upload/v1667963352/mowsrw245cbs74dvevvq.jpg"
        }
    })
    res.status(200).json({
        status:true,
        like:true,
        count
    })  
    
    }
    catch(err) {return next(new ErrorResponse(err.message,500))}  
    
})
