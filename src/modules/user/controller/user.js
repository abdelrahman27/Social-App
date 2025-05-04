import { StatusCodes,ReasonPhrases } from "http-status-codes"
import userModel from "../../../../DB/model/user.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import cloudinary from "../../../utils/cloudinary.js"
import bcrypt from 'bcryptjs'
import CryptoJS from "crypto-js"
import { customAlphabet } from "nanoid"
import sendEmail, { createHtml } from "../../../utils/email.js"
import jwt from 'jsonwebtoken'
import { apiFeatures } from "../../../utils/apiFeatures.js"
// return next(new ErrorClass("this Email is already Exist",StatusCodes.NOT_ACCEPTABLE))


export const signUp = async(req,res,next)=>{
    let {password, phone}=req.body 
    const {name , email , cPassword  , age }=req.body
    const isEmailExist = await userModel.findOne({email})//search in database if email not exist its acceptable cause email must be unique
    if (isEmailExist) {
        return next(new ErrorClass("this Email is already Exist",StatusCodes.NOT_ACCEPTABLE))
    }
    //if user  upload profile picture upload it to cloudinary
    let image
    if(req.file){
        image =await cloudinary.uploader.upload(req.file.path,{folder:"social/userProfile"})
        
    }//check password and cpassword is match--cpassword is confirmation password
    if(password!= cPassword){
        return next(new ErrorClass("password and cPassword not match"))
    }//hash the password,,, the minus sign is to turn sult from string to be number for func
    password = bcrypt.hashSync(password , - process.env.SALT_ROUNDING)
    //encrypt phone number
    phone = CryptoJS.AES.encrypt(phone,process.env.ENCRYPTION_KEY)
    //random code from numbers only send in emails
    const num = customAlphabet("0987654321",6)
    const code =num()
    const html =createHtml(code)
    sendEmail(email,"Confirm Your Email Before Login",html)
    const addUser = await userModel.create({
        name,
        password,
        email,
        phone,
        profelPicture:{secure_url:image?.secure_url , public_id:image?.public_id},
        age,
        code
    })
    res.status(StatusCodes.CREATED).json({message:"done",addUser, status:ReasonPhrases.CREATED})
    async function  changeCode(){
        const num = customAlphabet("0987654321",6)
        const code =num()
        await userModel.updateOne({email},{code})
    }
    setTimeout( changeCode, 120000);
}


export const confirmEmail = async(req,res,next)=>{
    const {email, code}= req.body
    const isEmailExist = await userModel.findOne({email})
    if(!isEmailExist){
        return next(new ErrorClass('this email not exist' ,StatusCodes.NOT_FOUND))
    }
    if(isEmailExist.confirmEmail){
        return next(new ErrorClass('email already confirmed',StatusCodes.CONFLICT))
    }
    if (code != isEmailExist.code) {
        return next(new ErrorClass('invalide code',StatusCodes.NOT_ACCEPTABLE))
    }
    const num = customAlphabet("1234567890",6)
    const codeAfterConfirm = num()
    const confirmEmail = await userModel.updateOne({_id:isEmailExist._id},{confirmEmail:true ,code:codeAfterConfirm})
    res.status(StatusCodes.OK).json({message:'done',confirmEmail,status:ReasonPhrases.OK})
}


export const logIn = async(req,res,next)=>{
    const {email,password}=req.body
    ///check about email & password and return the same error to make it unknown to strangers what is wrong in two
    const isEmailExist = await userModel.findOne({email})
    if (!isEmailExist) {
        return next(new ErrorClass("one of password or Email or both is incorrect",StatusCodes.NOT_FOUND))
    }
    const checkPassword = bcrypt.compareSync(password,isEmailExist.password)
    if(!checkPassword){
        return next(new ErrorClass("one of password or Email or both is incorrect",StatusCodes.NOT_FOUND))
    }
    //check about confirmation and if it deleted or not after check password to not let any one know info about email not belong to him
    if(!isEmailExist.confirmEmail ){
        return next(new ErrorClass("Email Not Confirm Yet..confirm it and back",StatusCodes.CONFLICT))
    }
    if(isEmailExist.isDeleted){
        return next(new ErrorClass("Email Is deleted",StatusCodes.CONFLICT))
    }
    const payload ={
        email,
        id:isEmailExist._id
    }
    //token expire in 10 minutes
    const token =jwt.sign(payload,process.env.TOKEN_SIGNATURE , {expiresIn :60 *10})
    const refreshToken =jwt.sign(payload,process.env.TOKEN_SIGNATURE , {expiresIn :60 *60*24*365})
    await userModel.updateOne({_id:isEmailExist._id},{isLogen:true ,refreshToken:refreshToken })
    res.status(StatusCodes.OK).json({message:"OK",token,space:"--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------",refreshToken,status:ReasonPhrases.OK})
}


export const sendCode = async(req,res,next)=>{

    const {email}=req.body
    const isEmailExist = await userModel.findOne({email})
    if (!isEmailExist) {
        return next(new ErrorClass("email is not found", StatusCodes.BAD_REQUEST))
    }
    const code = parseInt(Math.random()*1000000)
    await userModel.updateOne({email:isEmailExist.email},{code})
    const html = createHtml(code)
    sendEmail(email,"Code For Forgetting Password",html)
    
    res.status(StatusCodes.OK).json({message:"Done.....Check Your Email",code,sttus:ReasonPhrases.OK})
    async function  changeCode(){
        const num = customAlphabet("0987654321",6)
        const code =num()
        await userModel.updateOne({email},{code})
    }
    setTimeout( changeCode, 120000);
}


export const forgetPassword = async(req,res,next)=>{

    let{password ,code}=req.body
    const{email}=req.body
    const isEmailExist = await userModel.findOne({email})
    if (!isEmailExist) {
        return next(new ErrorClass("email is not found", StatusCodes.BAD_REQUEST))
    }
    if (code != isEmailExist.code ) {
        return next(new ErrorClass("Code Is Wrong", StatusCodes.BAD_REQUEST))
    }
    const value = bcrypt.compareSync(password,isEmailExist.password)

    if (value) {
        return next(new ErrorClass("Enter New Password This Password Was The Old One", StatusCodes.NOT_ACCEPTABLE))
    }
    password = bcrypt.hashSync(password , -process.env.SALT_ROUND)
    await userModel.updateOne({email:isEmailExist.email},{password,confirmEmail:true})
    // const newCode = parseInt(Math.random()*1000000)
    // await userModel.updateOne({email},{password,code:newCode})
    res.status(StatusCodes.OK).json({message:"Password Updated Successfully...GO AND TRY LOGIN",status:ReasonPhrases.ok})
}


export const getAllUsers = async(req,res,next)=>{
    const apiFeature =new apiFeatures(userModel.find({isDeleted:false}).select('phone email firstName lastName id age isLogin profilePicture coverImages'),req.query).pagination()
    const Users = await apiFeature.mongooseQuery
    res.status(StatusCodes.OK).json({message:"done",Users,status:ReasonPhrases.OK})
} 


export const updateProfile = async(req,res,next)=>{
    if(req.body.email){
        // const isEmailExist =await userModel.findOne({email:req.body.email,_id:{$ne:req.user._id}})
        const isEmailExist =await userModel.findOne({email:req.body.email})
        //Did it cause i want to change confirm email status on DataBase
        if (isEmailExist) {
            // console.log(req.user._id.toString());
            // console.log(isEmailExist._id);
            // const mesi =(isEmailExist._id == req.user._id)
            // console.log(mesi);
            if (isEmailExist._id.toString() == req.user._id.toString()) {
                return next(new ErrorClass("this Email is already Your Email Now",StatusCodes.NOT_ACCEPTABLE))
            }else{
                return next(new ErrorClass("this Email is already Exist",StatusCodes.NOT_ACCEPTABLE))
            }
        }
        
        const code = parseInt(Math.random()*1000000)
        const html =createHtml(code)
        sendEmail(req.body.email,"confirm Your new Email",html)
        await userModel.updateOne({_id:req.user._id},{confirmEmail:false,code})
    }
    if(req.body.password){
        //get password cause we dont send password with auth for security
        const oldPassword =await userModel.findById(req.user._id).select('password')
        const checkThatIsANewPass = bcrypt.compareSync(req.body.password,oldPassword.password)
        if (checkThatIsANewPass) {
            return next(new ErrorClass("Enter New Password This is an old one",StatusCodes.NOT_ACCEPTABLE))
        }
        const newpassword = bcrypt.hashSync(req.body.password,-process.env.SALT_ROUNDING)
        req.body.password =newpassword
    }
    if(req.body.name){
        req.body.firstName = req.body.name.split(" ")[0]
        req.body.lastName = req.body.name.split(" ")[1]

    }
    ///--------------------WRONG HAPPENED----------------------------------------------------------------
    if(req.body.phone){
        const phone = CryptoJS.AES.encrypt(req.body.phone,process.env.ENCRYPTION_KEY)
        console.log(phone);
    }
    
    const updatedProfile = await userModel.updateOne({_id:req.user._id},req.body)
    res.status(StatusCodes.ACCEPTED).json({message:"done",updatedProfile,status:ReasonPhrases.ACCEPTED})

}


export const updateProfilePic= async(req,res,next)=>{

    if (req.user.profilePicture) {
        const profilePicture = req.user.profilePicture
        await cloudinary.uploader.destroy(profilePicture.public_id)
    }
    const uplaodProfilePic =await cloudinary.uploader.upload(req.file.path,{folder:"social/userProfile"})

    await userModel.updateOne({_id:req.user._id},{profilePicture:{secure_url:uplaodProfilePic.secure_url,public_id:uplaodProfilePic.public_id}})
    res.status(StatusCodes.OK).json({message:"done",uplaodProfilePic, status:ReasonPhrases.OK})

}



export const updateCoverPic= async(req,res,next)=>{

    const updateCoverPic =await cloudinary.uploader.upload(req.file.path,{folder:"social/usercoverImages"})

    await userModel.findOneAndUpdate({_id:req.user._id},{$push:{coverImages:{secure_url:updateCoverPic.secure_url,public_id:updateCoverPic.public_id}}})
    res.status(StatusCodes.OK).json({message:"done", status:ReasonPhrases.OK})
}


export const deleteUser = async(req,res,next)=>{

    await userModel.updateOne({_id:req.user._id},{isDeleted:true})
    await cloudinary.uploader.destroy(req.user.profilePicture.public_id)

    res.status(StatusCodes.OK).json({message:"done",updateCoverPic, status:ReasonPhrases.OK})

}