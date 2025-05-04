import {Schema , Types ,model} from "mongoose";


const userSchema = new Schema({
    name:String,
    firstName: {type:String },
    lastName: {type:String },
    email: {
        type:String ,
        unique:[true , "the Email Must To Be Unique"],
        required: true
    },
    password: {
        type:String ,
        required: [true,"password is required"]
    },
    phone: {
        type:String ,
        required: [true,"phone is required"]
    },
    profilePicture:{type:Object} , 
    coverImages:Array ,
    confirmEmail:{
        type:Boolean,
        default:false
    },
    age:{
        type:Number,
        min:[10,"Min Age Must be More Than 9"],
        max:[100,"Max number Must be Smaller than 101"],
        required:[true , "age is required"]
    },
    isDeleted:{ 
        type:Boolean,
        default:false
    },
    isLogin:{
        type:Boolean,
        default:false
    },
    code:{
        type:Number,
        
    },
    refreshToken:{
        type:String,
    }
},{
    timestamps:true
})

userSchema.pre("save",function(){
    this.firstName = this.name?.split(" ")[0]
    this.lastName = this.name?.split(" ")[1]
})

const userModel = model("User", userSchema)
export default userModel