import {Router} from 'express'
const router = Router();
import {upload} from 'multer';
import{loginUser} from '../controllers/user.controller.js'
router.route('/register').post(
    upload.fields([
    {
        name:"avatar",
        maxCount: 1

    },
     {
                  name:"coverImage",
                  maxCount:1
    }

    ]),
)
router.route('/login').post('')