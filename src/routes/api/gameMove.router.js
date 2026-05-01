import { Router } from "express";
import GameMoveController from "../../controllers/gameMove.controller.js";

const GameMoveRouter = Router({ mergeParams: true });
GameMoveRouter.post("/", GameMoveController.placeCard);

export default GameMoveRouter;