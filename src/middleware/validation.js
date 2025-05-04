import Joi from "joi"
import { Types } from "mongoose"
const dataMethod = ["body" , "query" , "params" , "file" ,"headers"]

//check ids if correct or not
const validateObjectId = (value,helper)=>{
    
    if(Types.ObjectId.isValid(value)){
        return true
    }else{
        return helper.message("Invalid ObjectId")
    }
}



//to be easy when we make validation to apies to less the dublcated
export const generalFields = {

    email: Joi.string().email({
        minDomainSegments: 2 , 
        maxDomainSegments: 4 ,
        tlds:{ allow:["net" , "com"]}
    }),
    password : Joi.string(),
    cPassword: Joi.string().required(),
    id: Joi.string().custom(validateObjectId).required(),
    phone:Joi.string(),
    name: Joi.string().max(100).min(2),
    file:Joi.object({
        size:Joi.number().required() , 
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required()
    })
}

export const validation = (schema) => {
    return (req, res, next) => {
        const validationErr = []
        dataMethod.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push(validationResult.error.details)
                }
            }
        });

        if (validationErr.length) {
            return res.json({ message: "Validation Err", validationErr })
        }
        return next()
    }
}