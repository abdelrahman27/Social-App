import Joi from "joi"
import { generalFields } from "../../middleware/validation.js"



export const signUpValidation  ={

    body:Joi.object().required().keys({
        name:generalFields.name.required(),
        email:generalFields.email.required(),
        password:generalFields.password.required(),
        cPassword:generalFields.cPassword,
        phone:generalFields.phone.required(),
        age:Joi.number().required(),
    }),
    file:generalFields.file ,
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}


export const confirmEmailValidation = {
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
        code:Joi.number().required().min(5)
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}


export const logInValidation = {
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
        password:generalFields.password.required()
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}

export const sendCodeValidation = {
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}


export const forgetPasswordValidation = {
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
        password:generalFields.password.required(),
        code:Joi.number().required().min(5)
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}


export const updateProfileValidation = {
    body:Joi.object().required().keys({
        email:generalFields.email,
        password:generalFields.password,
        name:generalFields.name,
        phone:generalFields.phone,
        age:Joi.number()
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}
