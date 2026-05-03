import { Router } from "express";
import GameSelectionController from "../../controllers/api/gameSelection.controller.js";

const GameSelectionRouter = Router({ mergeParams: true });

GameSelectionRouter.get("/", GameSelectionController.getSelection);
GameSelectionRouter.post("/add", GameSelectionController.addCard);
GameSelectionRouter.post("/remove", GameSelectionController.removeCard);
GameSelectionRouter.post("/reset", GameSelectionController.resetSelection);

export default GameSelectionRouter;