import {Router} from 'express'
const router =Router();
import authenticateUser from '../controllers/authenticate.js'
import { postmess,getmess,creategroup ,fetchusers} from '../controllers/message.js';
router.post('/sendmessage',authenticateUser,postmess)
router.get('/messages',authenticateUser,getmess)
router.post('/creategroup',authenticateUser ,  creategroup)
router.get('/users',fetchusers)

export default router;