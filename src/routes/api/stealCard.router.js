import { Router } from "express";
import StealCardController from "../../controllers/api/stealCard.controller.js";

const router = Router({ mergeParams: true });
router.get("/", StealCardController.getStealableCards);
router.post("/", StealCardController.stealCard);

export default router;