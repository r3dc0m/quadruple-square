import { Router } from "express";
import BoardRouter from "./gameBoard.router.js";

const router = Router();

router.use("/:id/positions", BoardRouter);

export default router;