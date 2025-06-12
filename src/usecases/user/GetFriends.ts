import { IUserRepository } from "domain/repositories/IUserRepository";

export class GetFriends {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: { id: string }) {
    const { id } = input;

    const friends = await this.repo.getFriends(id);
    return { friends };
  }
}
