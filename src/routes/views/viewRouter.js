import { Router } from "express";
import CollectionViewController from "../../controllers/views/collection.controller.js";

const viewRouter = Router();

viewRouter.get("/players/:id/collection", CollectionViewController.getCollectionPage);

export default viewRouter;