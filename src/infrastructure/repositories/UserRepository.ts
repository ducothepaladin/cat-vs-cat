import Users from "../../infrastructure/db/models/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { generateToken, verifyRefreshToken } from "../../lib/util/token";

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
      id: fr.userId?._id,
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

  async addNewFriend(userId: string, friendEmail: string): Promise<void> {

    const user = await Users.findById(userId);
    const friend = await Users.findOne({email: friendEmail});

    if (!user || !friend) throw new Error("Not found");

    if(user == friend) throw new Error("Cannot add yourself as a friend");

    await Users.findByIdAndUpdate(userId, {
      $addToSet: {
        friends: { userId: friend._id },
      },
    });
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const exist = await Users.findOne({email});
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

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {

    if(!refreshToken) throw new Error('Refresh token need..');

    let userId;
      try {
        const decoded = verifyRefreshToken(refreshToken);
        userId = (decoded as any)._id;
      } catch (err) {
        throw new Error("Invalid or expired refresh token");
      }

      const user = await this.getUserById(userId);
        if (!user) {
          throw new Error("User not found");
        }
      
        const newToken = generateToken(user.id);
        return { ...newToken };

  }
}
