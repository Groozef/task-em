import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";

const router = Router();

router.get("/history", HistoryController.getHistory);

export default router;
