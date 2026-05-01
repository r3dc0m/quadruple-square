import { Router } from "express";
import BoardRouter from "./gameBoard.router.js";
import GameRouter from "./game.router.js";
import GameMoveRouter from "./gameMove.router.js";
import StealCardRouter from "./stealCard.router.js";
import GameStatusRouter from "./gameStatus.router.js";

const router = Router({ mergeParams: true });

router.use("/:id/:botId/newgame", GameRouter);
router.use("/:id/positions", BoardRouter);
router.use("/:gameId/move", GameMoveRouter);
router.use("/:gameId/steal", StealCardRouter);
router.use("/:gameId/status", GameStatusRouter);

export default router;