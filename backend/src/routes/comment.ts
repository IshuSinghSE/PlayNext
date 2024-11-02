import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/comment.ts";

const router = Router();

router.route("/:videoId").get(getComments).post(createComment);
router.route("/:commentId").delete(deleteComment).patch(updateComment);


export default router;