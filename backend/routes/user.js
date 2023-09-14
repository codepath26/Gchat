import {Router} from 'express'
import {signup , logincheck} from '../controllers/user.js'

const router = Router();

router.post("/signup", signup);

router.post("/login",logincheck);





export default router;
