import {Router} from 'express'
const router =Router();
import authenticateUser from '../controllers/authenticate.js'
import { postmess,getmess } from '../controllers/message.js';
router.post('/sendmessage',authenticateUser,postmess)
router.get('/messages',authenticateUser,getmess)

export default router;