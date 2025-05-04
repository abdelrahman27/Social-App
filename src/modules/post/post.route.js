import { Router } from "express";
import {asyncHandler} from "../../utils/errorHandling.js" 
import {fileUpload, fileValidation} from "../../utils/multer.js"
import  {validation} from "../../middleware/validation.js";
import * as Val from '../post/post.validation.js'
import * as postController from './controller/post.js'
import auth from "../../middleware/auth.js";

const router =Router()

router.post("/add-post",
    auth,
    fileUpload(fileValidation.image).single("image"),
    validation(Val.addPostValidation),
    asyncHandler(postController.addPost)

    )


router.put("/update-post",
    auth,
    fileUpload(fileValidation.image).single("image"),
    validation(Val.updatePostValidation),
    asyncHandler(postController.updatePost)
)

router.delete("/delete-post/:postId",
    auth,
    validation(Val.deletePostValidation),
    asyncHandler(postController.deletePost)
)

router.get("/today",
        auth,
        asyncHandler(postController.postsOfToday)
)


router.get("/yesterday",
        auth,
        asyncHandler(postController.postsOfYesterday)
)

router.get("/",
    auth,
    asyncHandler(postController.getAllPosts)
)

router.route("/like-post")
    .patch(
            auth,
            validation(Val.likePostValidation),
            asyncHandler(postController.likePost))

    .delete(
            auth,
            validation(Val.likePostValidation),
            asyncHandler(postController.unlikePost)
    )

router.patch("/post-privacy/:postId",
        auth,
        validation(Val.updatedPostPrivacyValidation),
        asyncHandler(postController.updatePostPrivacy)
)


router.get("/:postId",
        auth,
        validation(Val.getPostByIdValidation),
        asyncHandler(postController.getPostById)
)








export default router