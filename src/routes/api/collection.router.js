import { Router } from "express";
import CollectionController from "../../controllers/collection.controller.js";

const CollectionRouter = Router({ mergeParams: true });

CollectionRouter.get("/", CollectionController.getCollection);
CollectionRouter.get("/available", CollectionController.getAvailableCollection);

export default CollectionRouter;