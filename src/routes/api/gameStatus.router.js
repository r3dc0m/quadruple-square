import { Router } from "express";
import GameStatusController from "../../controllers/gameStatus.controller.js";

const GameStatusRouter = Router({ mergeParams: true });

GameStatusRouter.get("/", GameStatusController.getGameStatus);

export default GameStatusRouter;