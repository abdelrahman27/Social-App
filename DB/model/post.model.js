import {Types,Schema,model} from "mongoose"


const postSchema = new Schema({

    content:{
        type:String,
        max:[500,"max size Of Content 500"]
    },
    video:{
        type:Object
    },
    image:Object,
    createdBy:{type:Types.ObjectId , ref:"user",required:true},
    commentsId:[{
        type:[Types.ObjectId],
        ref:"Comment"
        }]
    ,
    likes:[{
        type:[Types.ObjectId],
        ref:"User",
        unique:[true,"you make like before"]
        }],
    privacy:{
        type:String,
        enum:["onlyMe","public"],
        default: "public"
    }///onlyMe this post can't see to any one expe the user ,public every one can see the post
},
{
    toJSON: {virtuals: true},
    toObject:{virtuals: true},
    timestamps: true
})
postSchema.virtual("Comments",
{
    localField:"_id",
    foreignField:"postId",
    ref:"Comment"
}
)

const postModel =model("Post",postSchema)

export default postModel