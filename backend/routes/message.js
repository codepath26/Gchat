import {Router} from 'express'
const router =Router();
import authenticateUser from '../controllers/authenticate.js'
import { postmess,getmess,creategroup ,fetchusers , getgroupname, getgroupmessage} from '../controllers/message.js';
router.post('/sendmessage',authenticateUser,postmess)
router.get('/messages',authenticateUser,getmess)
router.post('/creategroup',authenticateUser,creategroup)
router.get('/users',fetchusers)
router.get('/gname',authenticateUser,getgroupname)
router.get('/gmessage',getgroupmessage)

export default router;