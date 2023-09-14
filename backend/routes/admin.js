import {Router} from 'express'
import authenticateUser from '../middleware/authenticate.js'
import {makeAdmin , removeAdmin} from "../controllers/admin.js"

const router = Router();

router.get(
  "/",
   authenticateUser,
   makeAdmin);

router.delete(
  "/",
  authenticateUser,
  removeAdmin);





export default router;
