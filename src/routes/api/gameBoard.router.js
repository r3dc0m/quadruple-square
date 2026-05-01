import { Router } from "express";
import BoardController from "../../controllers/api/gameBoard.controller.js"

const BoardRouter = Router({ mergeParams: true });
BoardRouter.get("/", BoardController.getGameBoardPositions);

export default BoardRouter;