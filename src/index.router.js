import connectDB from "../DB/connectDb.js";
import postRouter from "./modules/post/post.route.js"
import userRouter from "./modules/user/user.route.js"
import commentRouter from "./modules/comment/comment.route.js"
import replyRouter from "./modules/replyComment/reply.route.js"
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app,express)=>{
    app.use(express.json({}));
    app.use("/post",postRouter)
    app.use("/user",userRouter)
    app.use("/reply",replyRouter)
    app.use("/comment",commentRouter)
    //if any route not in above the next appUse will be call
    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    //any error in project
    app.use(globalErrorHandling)
    connectDB()
    
}

export default initApp