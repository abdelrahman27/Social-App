import { Router } from "express";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as Val from "./reply.validation.js"
import * as replyController from "./controller/reply.js"

const router = Router({mergeParams:true})


router.route('/:replyId')
    .patch(
        auth,
        validation(Val.updateReplyValid),
        asyncHandler(replyController.updateReply)
    )
    .delete(
        auth,
        validation(Val.deleteReplyValid),
        asyncHandler(replyController.deleteReply)
    )
    .put(
        auth,
        validation(Val.likeReplyValid),
        asyncHandler(replyController.likeReply)
    )
    .get(
        auth,
        validation(Val.likeReplyValid),
        asyncHandler(replyController.unlikereply)
    )

router.route('/')
    .post(
        auth,
        validation(Val.addReplyValid),
        asyncHandler(replyController.addReplyComment)
    )



export default router