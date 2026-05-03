import { Router } from "express";
import BoardRouter from "./gameBoard.router.js";
import GameRouter from "./game.router.js";
import GameSelectionRouter from "./gameSelection.router.js";
import CollectionRouter from "./collection.router.js";
import GameMoveRouter from "./gameMove.router.js";
import StealCardRouter from "./stealCard.router.js";
import GameStatusRouter from "./gameStatus.router.js";

const router = Router({ mergeParams: true });

router.use("/:id/positions", BoardRouter);
router.use("/:id/game", GameRouter);
router.use("/:id/game-selection", GameSelectionRouter);
router.use("/:id/collection", CollectionRouter);
router.use("/:id/:gameId/move", GameMoveRouter);
router.use("/:id/:gameId/steal", StealCardRouter);
router.use("/:id/:gameId/status", GameStatusRouter);
router.use("/:gameId/status", GameStatusRouter);

export default router;