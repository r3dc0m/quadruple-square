import { Router } from "express";
import CollectionViewController from "../../controllers/views/collection.controller.js";
import GameViewController from "../../controllers/views/game.controller.js";
import AuthViewRouter from '../auth.router.js';
import { requireAuth } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use('/', AuthViewRouter);

viewRouter.get("/players/:id/collection", requireAuth, CollectionViewController.getCollectionPage);
viewRouter.get("/players/:id/newgame", requireAuth, GameViewController.getNewGame);
viewRouter.get("/players/:id/game/:gameId", requireAuth, GameViewController.getGamePage);
viewRouter.get("/players/:id/game/:gameId/cancel", requireAuth, GameViewController.cancelGameByPlayer);
viewRouter.post("/players/:id/game-selection/add/:cardId", requireAuth, GameViewController.addCardToSelection);
viewRouter.post("/players/:id/game-selection/remove/:cardId", requireAuth, GameViewController.removeCardFromSelection);
viewRouter.post("/players/:id/commitgame", requireAuth, GameViewController.commitGame);

export default viewRouter;