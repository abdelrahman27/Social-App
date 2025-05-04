import { Router } from "express";
import {asyncHandler} from "../../utils/errorHandling.js" 
import {fileUpload, fileValidation} from "../../utils/multer.js"
import { validation } from "../../middleware/validation.js";
import * as Val from "./user.validation.js"
import * as userController from "./controller/user.js"
import auth from "../../middleware/auth.js";
const router = Router()


router.post('/signUp',
    fileUpload(fileValidation.image).single("profilePicture"),
    validation(Val.signUpValidation),
    asyncHandler(userController.signUp)
)

router.post('/confirm-email',
    validation(Val.confirmEmailValidation),
    asyncHandler(userController.confirmEmail)
)

router.post('/log-in',
    validation(Val.logInValidation),
    asyncHandler(userController.logIn)
)

router.post('/send-code',
    validation(Val.sendCodeValidation),
    asyncHandler(userController.sendCode)  
)

router.post('/update-profile',
    auth,
    validation(Val.updateProfileValidation),
    asyncHandler(userController.updateProfile)
)

router.post('/fotget-password',
    validation(Val.forgetPasswordValidation),
    asyncHandler(userController.forgetPassword)  
)

router.get('/get-user',
    asyncHandler(userController.getAllUsers)
)

router.post('/update-profile-image',
    auth,
    fileUpload(fileValidation.image).single("profilePicture"),
    asyncHandler(userController.updateProfilePic)
)

router.post('/update-cover-image',
    auth,
    fileUpload(fileValidation.image).single("coverImage"),
    asyncHandler(userController.updateCoverPic)
)


router.delete('/delete-user',
    auth,
    asyncHandler(userController.deleteUser)
)



export default router