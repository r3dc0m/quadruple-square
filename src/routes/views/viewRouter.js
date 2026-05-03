import { Router } from "express";
import CollectionViewController from "../../controllers/views/collection.controller.js";
import GameViewController from "../../controllers/views/game.controller.js";

const viewRouter = Router();

viewRouter.get("/players/:id/collection", CollectionViewController.getCollectionPage);
viewRouter.get("/players/:id/newgame", GameViewController.getNewGame);
viewRouter.get("/players/:id/game/:gameId", GameViewController.getGamePage);
viewRouter.get("/players/:id/game/:gameId/cancel", GameViewController.cancelGameByPlayer);
viewRouter.post("/players/:id/game-selection/add/:cardId", GameViewController.addCardToSelection);
viewRouter.post("/players/:id/game-selection/remove/:cardId", GameViewController.removeCardFromSelection);
viewRouter.post("/players/:id/commitgame", GameViewController.commitGame);

export default viewRouter;