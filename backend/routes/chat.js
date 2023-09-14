import { Router } from "express";
import authenticateUser from '../middleware/authenticate.js'
import {postchat , getChat } from '../controllers/chat.js'


const router = Router();
router.post('/',authenticateUser , postchat)
router.get('/',authenticateUser , getChat)

export default router ;