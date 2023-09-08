import {Router} from 'express'
const router =Router();
import authenticateUser from '../controllers/authenticate.js'
import { postmess } from '../controllers/message.js';
router.post('/sendmessage',authenticateUser,postmess)

export default router;