import { Router } from "express";
import GameController from "../../controllers/game.controller.js"

const GameRouter = Router({ mergeParams: true });
GameRouter.post("/", GameController.createGame);

export default GameRouter;