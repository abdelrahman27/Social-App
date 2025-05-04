import Joi from "joi";
import {generalFields} from "../../middleware/validation.js"

export const addReplyValid = {
    body:Joi.object().required().keys({
        rBody:Joi.string().required().min(1).max(300)
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        commentId:generalFields.id
    }),
}


export const updateReplyValid = {
    body:Joi.object().required().keys({
        rBody:Joi.string().required().min(1).max(300)
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        replyId:generalFields.id
    }),
}


export const deleteReplyValid = {
    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        replyId:generalFields.id
    }),
}

export const likeReplyValid = {
    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        replyId:generalFields.id
    }),
}

