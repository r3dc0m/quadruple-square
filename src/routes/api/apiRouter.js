import { Router } from "express";
import BoardRouter from "./gameBoard.router.js";
import GameRouter from "./game.router.js";

const router = Router({ mergeParams: true });

router.use("/:id/newgame", GameRouter);
router.use("/:id/positions", BoardRouter);

export default router;