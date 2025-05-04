import { ReasonPhrases, StatusCodes } from "http-status-codes"
import commentModel from "../../../../DB/model/Comment.model.js"
import {ErrorClass} from "../../../utils/errorClass.js"
import replyModel from "../../../../DB/model/reply.model.js"


export const addReplyComment = async(req,res,next)=>{
    const {commentId}=req.params
    const {rBody}=req.body
    const comment = await commentModel.findById(commentId)
    if (!comment) {
        return next(new ErrorClass("No Comment Found or it May Be DELETED"),StatusCodes.BAD_REQUEST)
    }
    const reply = await replyModel.create({
        rBody,
        createdBy:req.user._id,
        commentId
    })
    await commentModel.updateOne({_id:commentId},{$push:{repliesId:reply._id}})
    res.status(201).json({message:"comment added",reply,status:201})
}

export const updateReply = async(req,res,next)=>{
    const {rBody}=req.body
    const{replyId}=req.params
    const reply = await replyModel.findById(replyId)
    if (!reply) {
        return next(new ErrorClass("No reply Found or it May Be DELETED"),StatusCodes.BAD_REQUEST)
    }
    if (reply.createdBy.toString()!= req.user._id.toString()) {
        return next(new ErrorClass("You Not Able To Update This Reply"),StatusCodes.BAD_REQUEST)
    }
    const updatereply = await replyModel.updateOne({_id:replyId},{rBody})
    res.status(StatusCodes.OK).json({message:"UPDATED SUCCESSFULLY",updatereply,status:ReasonPhrases.OK})
}

export const deleteReply = async(req,res,next)=>{
    const {replyId}= req.params
    const checkreply = await replyModel.findById(replyId)
    if (!checkreply) {
        return next(new ErrorClass("reply Not Founded or May Be Deleted"),StatusCodes.BAD_REQUEST)
    }
    if (checkreply.createdBy.toString() != req.user._id.toString()) {
        return next(new ErrorClass("You Not Able To Delete This reply"),StatusCodes.BAD_REQUEST)
    }
    const deleteReply = await replyModel.deleteOne({_id:replyId})
    res.status(StatusCodes.OK).json({message:"DELETED SUCCESSFULLY",deleteReply,status:ReasonPhrases.OK})
}


export const likeReply = async(req,res,next)=>{
    const {replyId}=req.params
    const reply = await replyModel.findById(replyId)
    if(!reply){
        return next(new ErrorClass("No reply Found or it May Be DELETED"),StatusCodes.BAD_REQUEST)
    }
    for (let i = 0; i < reply.likes.length; i++) {
        if(reply.likes[i].toString() == req.user._id.toString()){
            return next(new ErrorClass("you already make like before"),StatusCodes.BAD_REQUEST);
        } 
    }
    const like = await replyModel.updateOne({_id:replyId},{$push:{likes:req.user._id}})
    res.status(StatusCodes.OK).json({message:"done",like,status:ReasonPhrases.OK})
}


export const unlikereply = async(req,res,next)=>{
    const {replyId}=req.params
    const reply = await replyModel.findById(replyId)
    if(!reply){
        return next(new ErrorClass("No reply Found or it May Be DELETED"),StatusCodes.BAD_REQUEST)
    }
    for (let i = 0; i < reply.likes.length; i++) {
        if(reply.likes[i].toString() == req.user._id.toString()){
            const unlike = await replyModel.updateOne({_id:replyId},{$pull:{likes:req.user._id}})
            return res.status(StatusCodes.OK).json({message:"done",unlike,status:ReasonPhrases.OK})
        } 
    }
    return next(new ErrorClass("you don't make like before"),StatusCodes.BAD_REQUEST);
}