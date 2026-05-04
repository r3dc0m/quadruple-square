import { Router } from "express";
import apiRouter from "./api/apiRouter.js";
import viewRouter from "./views/viewRouter.js";
import userRouter from "./user.router.js";
import { requireAuth } from "../middleware/auth.js";
import adminRouter from "./admin.router.js";

const router = Router();

router.use('/', viewRouter);
router.use('/users', requireAuth, userRouter);
router.use('/api', requireAuth, apiRouter);
router.use('/admin', requireAuth, adminRouter)

export default router;