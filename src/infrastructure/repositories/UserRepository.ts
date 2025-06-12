import Users from "../../infrastructure/db/models/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { generateToken } from "../../lib/util/token";

export class UserRepository implements IUserRepository {
  async getUser(id: string): Promise<User | null> {
    const userDoc = await Users.findById(id).populate("friends.userId");

    if (!userDoc) throw new Error("User not found..");

    const user = new User(
      userDoc?._id?.toString() ?? "",
      userDoc?.name ?? "",
      userDoc?.email ?? "",
      userDoc?.friends ?? []
    );

    return user;
  }

  async getUserById(
    id: string
  ): Promise<{ id: string; name: string; email: string } | null> {
    const user = await this.getUser(id);

    if (!user) return null;

    return { id: user.id, name: user.name, email: user.email };
  }

  async getFriends(id: string): Promise<any[] | null> {
    const user = await this.getUser(id);

    if (!user) return null;

    return user.friends.map((fr: any) => ({
      name: fr.userId?.name,
      email: fr.userId?.email,
    }));
  }

  async getUserByEmail(
    email: string
  ): Promise<{ id: string; name: string; email: string } | null> {
    const userDoc = await Users.findOne({ email });
    if (!userDoc) throw new Error("User not found..");

    const user = this.getUser(userDoc._id.toString());
    return user;
  }

  async addNewFriend(userId: string, friendId: string): Promise<void> {
    if (userId == friendId) throw new Error("Cannot add yourself as a friend");

    const user = await Users.findById(userId);
    const friend = await Users.findById(friendId);

    if (!user || !friend) throw new Error("Not found");

    await Users.findByIdAndUpdate(userId, {
      $addToSet: {
        friends: { userId: friendId },
      },
    });
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const exist = await this.getUserByEmail(email);
    if (exist) throw new Error("Email is already in used.");

    const user = new Users({ name, email, password });
    await user.save();

    let token;
    try {
      token = generateToken(user._id.toString());
    } catch (err) {
      await Users.findByIdAndDelete(user._id);
      throw new Error("Can't Generate the Token");
    }
    return { ...token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = (await Users.findOne({ email })) as any;
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid Email or Password");
    }

    const token = generateToken(user._id.toString());

    return { ...token };
  }
}
