import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";

const auth = async (req, res, next) => {
        try {
            //get token with bearer key from headeres
            const { authorization } = req.headers;
            if(!authorization){
                return res.json({ message: "you have to send token" })
            }
            //check if token come with bearer key or not
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                return res.json({ message: "In-valid bearer key" })
            }
            //split token from bearer key and get token value in {token}
            const token = authorization.split(process.env.BEARER_KEY)[1]
            //check token value is assign correct in token or not
            if (!token) {
                return res.json({ message: "In-valid token" })
            }
            //decoded token with the signture of token
            const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
            //check token after decoded have id or not
            if (!decoded?.id) {
                return res.json({ message: "In-valid token payload" })
            }
            //get user with this id all Data except password
            const authUser = await userModel.findById(decoded.id).select('-password -code')
            //check if we have user with that id or not
            if (!authUser) {
                return res.json({ message: "Not register account" })
            }
            if(authUser.isDeleted){
                return res.json({ message: "This email is Deleted" })
            }
            //check if that user confirm Email before or not 
            if (!(authUser.confirmEmail)) {
                return res.json({ message: "you have to confirm your email first" })
            }
            // return user information on req.user
            req.user = authUser;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error" , err:error?.message })
        }
}


export default auth