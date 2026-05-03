import { Router } from "express";
import GameStatusController from "../../controllers/api/gameStatus.controller.js";

const GameStatusRouter = Router({ mergeParams: true });

GameStatusRouter.get("/", GameStatusController.getGameStatus);
GameStatusRouter.get("/full-state", GameStatusController.getFullGameState);

export default GameStatusRouter;