import express from "express";
import { addFriend, findUserById, getFriends } from "../../infrastructure/controllers/UserController";

const router = express.Router();


router.get("/get-friends/:id", getFriends);
router.get("/get-user/by-id/:id", findUserById);
router.patch("/add-friend/:id", addFriend);


export default router;