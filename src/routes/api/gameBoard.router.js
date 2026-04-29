import { Router } from "express";
import BoardController from "../../controllers/gameBoard.controller.js"

const BoardRouter = Router();

BoardRouter.get("/",BoardController.getGameBoardPositions);

export default BoardRouter;