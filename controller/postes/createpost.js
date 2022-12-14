const asynchandler = require("../../middleware/asynchandler")
const client = require("../../utils/database")
const ErrorResponse = require("../../utils/errorhandler")
const {activityUpdate} = require('../../utils/activityManager')
const { plans } = require("../../utils/database")


//@desc   To create a post 
//@url    POST /api/v1/post/create
//@access Private 
exports.createPost = asynchandler( async (req,res,next) => {


  try{ const post = await client.posts.create({
    data:{
        description:req.body.description,
        title:req.body.title,
        userpost:{
            connect:{
                id:req.user.id
            }
        }

    }
  })
  if(req.body.data){
    for await(let data of req.body.data){
        await client.postData.upsert({
            where:{
                data,
            },
            update:{
                post:{
                    connect:{
                       id:post.id
                    }
                }
            },
            create:{
                data,
                type:"unknown",
                post:{
                    connect:{
                        id:post.id
                    }
                }
            }
        })
    }
  }
  if(req.body.hashtag){
      //data sent ["iot","python","java","c++"]
      for await (let hash of req.body.hashtag){
        await client.hashtag.upsert({
            where:{
                tag:hash
            },
            update:{
                posts:{
                    connect:{
                        id:post.id,
                    }
                }
            },
            create:{
               tag:hash,
               posts:{
                connect:{
                    id:post.id,
                }
               } 
            }
        })
      }
  }
    // loging the activity 
    await client.activity.create({
        data:{
            useractivity:{
                connect:{
                    id:req.user.id
                }
            },
            type:"post",
            message:"the post is created and published",
            targetid:post.id,
            belongsTo:req.user.id,
            tagetpic:"https://res.cloudinary.com/dibccigcp/image/upload/v1665033764/1554406342596_afmara.jpg"
        }
    })
    
        res.status(200).json({
        status:true,
        message:"the post created"
         }).end()


    }
    catch ( err){return next(new ErrorResponse(err.message,456))}


})