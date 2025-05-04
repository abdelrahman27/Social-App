import { StatusCodes,ReasonPhrases } from "http-status-codes"
import { ErrorClass } from "../../../utils/errorClass.js"
import cloudinary from "../../../utils/cloudinary.js"
import { apiFeatures} from "../../../utils/apiFeatures.js"
import postModel from "../../../../DB/model/post.model.js"
import replyModel from "../../../../DB/model/reply.model.js"
import commentModel from "../../../../DB/model/Comment.model.js"


export const addPost = async(req,res,next)=>{
    const{content,privacy}=req.body
    let image
    if(req.file){
            image= await cloudinary.uploader.upload(req.file.path,{folder:"social/postImage"})
    }
    const createdBy =req.user._id
    const addPost = await postModel.create({
        content,
        privacy,
        image:{secure_url:image?.secure_url,public_id:image?.public_id},
        createdBy
    })
    res.status(StatusCodes.CREATED).json({message:"done",addPost, status:ReasonPhrases.CREATED})

}

export const updatePost = async(req,res,next)=>{
    const {postId}=req.body
    const checkUserIsOwner = await postModel.findById({_id:postId})
    if (!checkUserIsOwner) {
        return next(new ErrorClass("no Posts Found Or May Be Deleted",StatusCodes.NOT_FOUND))
    }else if(checkUserIsOwner){
        if(checkUserIsOwner.createdBy.toString()!= req.user._id.toString()){
            return next(new ErrorClass("You Not Allow To Edit This Post",StatusCodes.NOT_ACCEPTABLE))
        }
    }
    
    if(req.file){
        if (checkUserIsOwner.image) {
            await cloudinary.uploader.destroy(checkUserIsOwner.image.public_id)
        }
        const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:"social/postImage"})
        req.body.image = {secure_url,public_id}
    }
    const addPost = await postModel.updateOne({_id:postId},req.body)
    res.status(StatusCodes.OK).json({message:"done",addPost, status:ReasonPhrases.OK})

}

export const deletePost = async(req,res,next)=>{

    const {postId}=req.params
    const checkUserIsOwner = await postModel.findById({_id:postId})
    if (!checkUserIsOwner) {
        return next(new ErrorClass("NO Posts Found Or May Be Deleted",StatusCodes.NOT_FOUND))
    }else if(checkUserIsOwner){
        if(checkUserIsOwner.createdBy.toString()!= req.user._id.toString()){
            return next(new ErrorClass("You Not Allow To Delete This Post",StatusCodes.NOT_ACCEPTABLE))
        }
    }
    if (checkUserIsOwner.image) {
        await cloudinary.uploader.destroy(checkUserIsOwner.image.public_id)
    }
    //delete comments and reply on that post
    if (checkUserIsOwner.commentsId.length != 0) {
        for (let i = 0; i < checkUserIsOwner.commentsId.length; i++) {
            const reply = await commentModel.findByIdAndDelete({_id:checkUserIsOwner.commentsId[i]})
            if (reply.repliesId.length != 0) {
                for (let j = 0; j < reply.repliesId.length; j++) {
                    await replyModel.deleteOne({_id:reply.repliesId[j]})
                }    
            }
            }
            
        }
    const deletePost = await postModel.deleteOne({_id:postId})
    res.status(StatusCodes.OK).json({message:"Done",deletePost,status:ReasonPhrases.OK})
}


export const getAllPosts = async(req,res)=>{
    const apiFeature = new apiFeatures( postModel.find({privacy:"public"}).populate([{path:"Comments"}]),req.query).pagination()
    const posts =await apiFeature.mongooseQuery
    res.status(StatusCodes.OK).json({message:"done",posts,status:ReasonPhrases.OK})
}

export const likePost =  async(req,res,next)=>{
    const {postId} = req.body
    const checkPost = await postModel.findById({_id:postId})
    if (!checkPost) {
        return next(new ErrorClass("NO Post Found Or May Be Deleted",StatusCodes.NOT_FOUND))
    }
    for (let i = 0; i < checkPost.likes.length; i++) {
        const likes = checkPost.likes[i];
        if (likes.toString() == req.user._id.toString() ) {
            return next(new ErrorClass("you Like That Before",StatusCodes.NOT_ACCEPTABLE))
        }
    }
    const likePost = await postModel.updateOne({_id:postId},{$push:{likes:req.user._id}})
    res.status(StatusCodes.OK).json({message:"done",likePost,status:ReasonPhrases.OK})
}

export const unlikePost = async(req,res,next)=>{
    const {postId} = req.body
    const checkPost = await postModel.findById({_id:postId})
    if (!checkPost) {
        return next(new ErrorClass("NO Post Found Or May Be Deleted",StatusCodes.NOT_FOUND))
    }
    for (let i = 0; i < checkPost.likes.length; i++) {
        const likes = checkPost.likes[i];
        if (likes.toString() == req.user._id.toString() ) {
            const unlikePost = await postModel.updateOne({_id:postId},{$pull:{likes:req.user._id}})
            return res.status(StatusCodes.OK).json({message:"done",unlikePost,status:ReasonPhrases.OK})
        }
        
    }
    return next(new ErrorClass("youd don't make like to that post"),StatusCodes.NOT_ACCEPTABLE)
}

export const updatePostPrivacy = async(req,res,next)=>{
    const{postId}=req.params
    const{privacy}=req.body
    const checkPost = await postModel.findById(postId)
    if (!checkPost) {
        return next(new ErrorClass("No Posts Founded Or May Be Deleted",StatusCodes.BAD_REQUEST))
    }
    if (checkPost.createdBy.toString()!=req.user._id) {
        return next(new ErrorClass("You Not Allow To Edit ON This Post",StatusCodes.BAD_REQUEST))
    }
    if (privacy == checkPost.privacy) {
        return next(new ErrorClass("You Not Do Changes",StatusCodes.BAD_REQUEST))
    }
    const updatePostPrivacy = await postModel.updateOne({_id:postId},{privacy}) 
    res.status(200).json({message:'UPDATED',updatePostPrivacy})
}


//you can get any post byId exp onlyme post you can't get it >>but if you owner of post you can get it
export const getPostById = async(req,res,next)=>{
    const{postId}=req.params
    const post = await postModel.findById(postId).populate([{path:"Comments"}])
    if (!post) {
        return next(new ErrorClass("No POsts Found or May Be Deleted",StatusCodes.BAD_REQUEST))
    }
    if (post.privacy == "onlyMe" && req.user._id.toString() != post.createdBy.toString()) {
        return next(new ErrorClass("You Not Able To See This Post",StatusCodes.BAD_REQUEST))
    }
    res.status(StatusCodes.OK).json({message:"done",post,status:ReasonPhrases.OK})
}


export const postsOfToday = async(req,res,next)=>{
    //get date of now and sperate it to number of day , num month and year
    let dateNow = new Date()
    //make today value with start of day if today 5-10-2023 today value be 4-10-2023 11:59:59
    let today = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
    // const postsOfToday = await postModel.find({privacy:"public",createdAt:{$gte:today}})
    // const apiFeaturs = new apiFeatures(postsOfToday, req.query).pagination()
    // const posts = await apiFeaturs.mongooseQuery
    const apiFeaturs = new apiFeatures(postModel.find({privacy:"public",createdAt:{$gte:today}}), req.query).pagination()
    const posts = await apiFeaturs.mongooseQuery
    if (!posts) {
        return next(new ErrorClass({message: "NO Posts For Today Founded"}))
    }
    res.status(StatusCodes.OK).json({message:"done",posts,status:ReasonPhrases.OK})
}


export const postsOfYesterday = async(req,res,next)=>{
    //get date of now and sperate it to number of day , num month and year
    let dateNow = new Date()
    //-1 to get day before
    let startDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
    let Yesterday = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate()-1)
    
    const apiFeatur = new apiFeatures(postModel.find({privacy:"public",createdAt:{$gte:Yesterday,$lte:startDay}}),req.query).pagination()
    const posts = await apiFeatur.mongooseQuery 
    // if (posts.lenght == 0) {
    //     return next(new ErrorClass({message: "NO Posts For Yesterday Founded"}))
    // }
    res.status(StatusCodes.OK).json({message:"done",posts,status:ReasonPhrases.OK})
}

