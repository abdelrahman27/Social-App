import {Types , Schema , model} from "mongoose"

const commentSchema =new Schema({

    cbody:{//body of comment
        type:String,
        max:[200,"max to type 200"],
        min:[1,"at least type one charachter"],
        required: true 
    },
    createdBy:{//owner of comment
        type:Types.ObjectId ,
        ref: "User",
        required:[false,"userId Is required"]
    },
    postId:{//post whose that comment belongs to
        type:Types.ObjectId,
        ref:"Post",
        required:[false,"Postid Is required"]
    },
    repliesId:[{//replies on that specify comment
        type:[Types.ObjectId],
        ref:"Reply",required:[false,"replyid Is required"]
        }]
    ,
    likes:[{//likes on that comment
        type:[Types.ObjectId],
        ref:"User",required:[false,"likeId Is required"]
        }]
},{
    timestamps: true
})

//create Model
const commentModel = model("Comment",commentSchema)
//export to be enable to see in the project files
export  default commentModel