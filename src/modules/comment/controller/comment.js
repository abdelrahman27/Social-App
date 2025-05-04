import { ReasonPhrases, StatusCodes } from "http-status-codes"
import commentModel from "../../../../DB/model/Comment.model.js"
import postModel from "../../../../DB/model/post.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import replyModel from "../../../../DB/model/reply.model.js"



export const addcomment = async(req,res,next)=>{
    const {postId}= req.params
    const {cbody}= req.body
    const createdBy =req.user._id
    const checkPost = await postModel.findById(postId)
    if (!checkPost) {
        return next(new ErrorClass("post Not Found Or may Be Deleted"),StatusCodes.BAD_REQUEST)
    }
    const addcomment = await commentModel.create({
        cbody,
        createdBy,
        postId
    })//addCOmment To Post Model
    await postModel.updateOne({_id:postId},{$push:{commentsId:addcomment._id}})
    res.status(201).json({message:"comment added",addcomment,status:201})
}

export const updateComment = async(req,res,next)=>{
    const {commentId}= req.params
    const cbody = req.body.cbody
    const checkComment = await commentModel.findById(commentId)
    if (!checkComment) {
        return next(new ErrorClass("Comment Not Founded or May Be Deleted"),StatusCodes.BAD_REQUEST)
    }
    if (checkComment.createdBy.toString() != req.user._id.toString()) {
        return next(new ErrorClass("You Not Able To Update This Comment"),StatusCodes.BAD_REQUEST)
    }///Nothing able to change only body of comments
    const updateComment = await commentModel.updateOne({_id:commentId},{cbody})
    res.status(StatusCodes.OK).json({message:"UPDATED SUCCESSFULLY",updateComment,status:ReasonPhrases.OK})
}


export const deleteComment = async(req,res,next)=>{
    const {commentId}= req.params
    const checkComment = await commentModel.findById(commentId)
    if (!checkComment) {
        return next(new ErrorClass("Comment Not Founded or May Be Deleted"),StatusCodes.BAD_REQUEST)
    }
    if (checkComment.createdBy.toString() != req.user._id.toString()) {
        return next(new ErrorClass("You Not Able To Delete This Comment"),StatusCodes.BAD_REQUEST)
    }
    if (checkComment.repliesId.length != 0) {
        for (let i = 0; i < checkComment.repliesId.length; i++) {
            await replyModel.deleteOne({_id:checkComment.repliesId[i]})
        }
    }
    const deleteComment = await commentModel.deleteOne({_id:commentId})
    res.status(StatusCodes.OK).json({message:"DELETED SUCCESSFULLY",deleteComment,status:ReasonPhrases.OK})
}

export const likeComment = async(req,res,next)=>{
    const {commentId}=req.params
    const comment = await commentModel.findById(commentId)
    if(!comment){
        return next(new ErrorClass("No Comment Found or it May Be DELETED"),StatusCodes.BAD_REQUEST)
    }
    for (let i = 0; i < comment.likes.length; i++) {
        if(comment.likes[i].toString() == req.user._id.toString()){
            return next(new ErrorClass("you already make like before"),StatusCodes.BAD_REQUEST);
        } 
    }
    const like = await commentModel.updateOne({_id:commentId},{$push:{likes:req.user._id}})
    res.status(StatusCodes.OK).json({message:"done",like,status:ReasonPhrases.OK})
}


export const unlikeComment = async(req,res,next)=>{
    const {commentId}=req.params
    const comment = await commentModel.findById(commentId)
    if(!comment){
        return next(new ErrorClass("No Comment Found or it May Be DELETED"),StatusCodes.BAD_REQUEST)
    }
    for (let i = 0; i < comment.likes.length; i++) {
        if(comment.likes[i].toString() == req.user._id.toString()){
            const unlike = await commentModel.updateOne({_id:commentId},{$pull:{likes:req.user._id}})
            return res.status(StatusCodes.OK).json({message:"done",unlike,status:ReasonPhrases.OK})
        } 
    }
    return next(new ErrorClass("you don't make like before"),StatusCodes.BAD_REQUEST);
}