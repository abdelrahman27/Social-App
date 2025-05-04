import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import replyRouter from "../replyComment/reply.route.js"
import auth from "../../middleware/auth.js";
import * as Val from "../comment/comment.validation.js"
import * as commentController from "../comment/controller/comment.js"

const router = Router()

router.use('/:commentId/reply',replyRouter)


router.post("/:postId",
    auth,
    validation(Val.addCommentValidation),
    asyncHandler(commentController.addcomment))

router.route("/:commentId")
    .patch(
        auth,
        validation(Val.updateCommentVal),
        asyncHandler(commentController.updateComment)
    )
    .delete(
        auth,
        validation(Val.deleteCommentVal),
        asyncHandler(commentController.deleteComment)
    )
    .put(
        auth,
        validation(Val.likeCommentVal),
        asyncHandler(commentController.likeComment)
    )
    .get(
        auth,
        validation(Val.unLikeCommentVal),
        asyncHandler(commentController.unlikeComment)
    )

    

export default router