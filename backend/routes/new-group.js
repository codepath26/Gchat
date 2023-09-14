import { Router } from "express";
import authenticateUser from '../middleware/authenticate.js'
import {postNewGroup,getUsers,addUserToGroup ,deleteUserFromGroup,postUpdateGroup } from '../controllers/new-group.js'


const router = Router();
router.post('/',authenticateUser , postNewGroup)
router.get('/users',authenticateUser , getUsers)
router.get('/add-user',authenticateUser , addUserToGroup)
router.delete("/delete-user",authenticateUser , deleteUserFromGroup)
router.post("/edit-group",authenticateUser , postNewGroup);

export default router ;