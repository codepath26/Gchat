import {Router} from 'express'
import {signup , logincheck} from '../controllers/user.js'
import authenticateUser from '../controllers/authenticate.js'
const router = Router();

router.post("/signup", signup);

router.post("/login",authenticateUser,logincheck);




export default router;
