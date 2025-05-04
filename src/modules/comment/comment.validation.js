import Joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const addCommentValidation ={
    body:Joi.object().required().keys({
        cbody:Joi.string().required()
    }),
    params:Joi.object().required().keys({
        postId:generalFields.id
    }),
    query:Joi.object().required().keys()
}


export const updateCommentVal = {
    body:Joi.object().required().keys({
        cbody:Joi.string().min(1)
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        commentId:generalFields.id
    })
}


export const deleteCommentVal = {
    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        commentId:generalFields.id
    })
}


export const likeCommentVal = {
    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        commentId:generalFields.id
    })
}


export const unLikeCommentVal = {
    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        commentId:generalFields.id
    })
}