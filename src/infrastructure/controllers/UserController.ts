import { Response, Request } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetFriends } from "../../usecases/user/GetFriends";
import { FindUserById } from "../../usecases/user/FindUserById";
import { AddFriend } from "../../usecases/user/AddFriend";

export const getFriends = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usecase = new GetFriends(new UserRepository());
    const result = await usecase.execute({ id });

    res.status(200).json({
      message: "Got user friends",
      content: {
        friends: result.friends,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const findUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const usecase = new FindUserById(new UserRepository());
    const result = await usecase.execute({ id });

    res.status(200).json({
      message: "User found",
      content: {
        user: result.user,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};

export const addFriend = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { friendId } = req.body;
  try {
    const usecase = new AddFriend(new UserRepository());
    await usecase.execute({ userId: id, friendId });

    res.status(200).json({
      message: "Friend Added",
      content: {},
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
};
