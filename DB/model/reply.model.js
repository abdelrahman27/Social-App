import {Types,Schema , model} from "mongoose"

const replySchema = new Schema ({

    rBody:{
        type:String,
        max:[300,"max must be 300"],
        min:[1,"it must be one character At least"],
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref: "User",
        required:false
    },
    commentId:{
        type:Types.ObjectId,
        ref:"Comment",
        required:false
    },
    likes:[{type:Types.ObjectId , ref:"User" , required:false}]
},{
    timestamps:true
})



const replyModel = model("Reply" , replySchema)

export default replyModel