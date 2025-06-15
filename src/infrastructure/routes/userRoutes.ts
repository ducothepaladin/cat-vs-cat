import express from "express";
import { addFriend, findUserById, getFriends } from "../../infrastructure/controllers/UserController";
import { auth } from "../../infrastructure/middlewares/auth";

const router = express.Router();

router.use(auth);

router.get("/get-friends", getFriends);
router.get("/get-user/by-id", findUserById);
router.patch("/add-friend", addFriend);


export default router;