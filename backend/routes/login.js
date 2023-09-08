import {Router} from 'express'
import {signup , logincheck} from '../controllers/user.js'
const router = Router();

router.post("/user/signup", signup);

router.post("/user/login",logincheck);




export default router;
