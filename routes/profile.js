// routes for profile 

const routes = require("express").Router()
const profile = require("../controller/profile/profile")
const {protect}  =require("../middleware/auth");



// mounting the routes 

routes.route("/edit").patch(protect,profile.editProfile); 
routes.route("/my").get(protect,profile.getMyProfile);
routes.route('/resume').get(protect,profile.resumeBuilder);
routes.route('/usereducation').post(protect,profile.updateUserEducation);
routes.route('/usercompany').post(protect,profile.updateUserCompany);
routes.route('/viewed').get(protect,profile.viwedProfile);
routes.route('/getfollower').get(protect,profile.getFollowers)
routes.route('/:profileid').get(protect,profile.getProfile);


routes.route('/').post(protect,profile.followPeople)


module.exports = routes
