import { Router } from "express";
import authenticateUser from '../middleware/authenticate.js'
import {getGroups ,getMembers ,getNonMembers } from '../controllers/group.js'


const router = Router();
router.get('/',authenticateUser , getGroups)
router.get('/getmembers',authenticateUser , getMembers)
router.get('/getNonMembers',authenticateUser , getNonMembers)

export default router ;