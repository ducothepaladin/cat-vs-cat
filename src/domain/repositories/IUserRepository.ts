import { User } from "../../domain/entities/User";

export interface IUserRepository {
  getUser(id: string): Promise<User | null>;
  getUserById(
    id: string
  ): Promise<{ id: string; name: string; email: string } | null>;
  getUserByEmail(
    email: string
  ): Promise<{ id: string; name: string; email: string } | null>;
  getFriends(id: string): Promise<any[] | null>;
  addNewFriend(userId: string, friendId: string): Promise<void>;
  register(
    name: string,
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  refresh(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
