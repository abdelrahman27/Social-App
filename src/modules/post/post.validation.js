import Joi from "joi"
import { generalFields } from "../../middleware/validation.js"

const privacy = (value,helper)=>{
    if(value == "onlyMe"||value == "public"){
        return true
    }else{
        return helper.message("Value MUst be 'public' or 'onlyMe'")
    }
}

export const addPostValidation  ={

    body:Joi.object().required().keys({
        content:Joi.string(),
        privacy:Joi.string()
    }),
    file:generalFields.file ,
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys()
}

export const updatePostValidation  ={

    body:Joi.object().required().keys({
        
        content:Joi.string(),
        privacy:Joi.string(),
        postId:generalFields.id
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys()
}


export const deletePostValidation  ={

    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        postId:generalFields.id
    })
}


export const likePostValidation  ={

    body:Joi.object().required().keys({
        postId:generalFields.id
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({})
}


export const updatedPostPrivacyValidation  ={

    body:Joi.object().required().keys({
        privacy:Joi.string().custom(privacy).required()
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        postId:generalFields.id
    })
}

export const getPostByIdValidation  ={

    body:Joi.object().required().keys(),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys({
        postId:generalFields.id
    })
}

