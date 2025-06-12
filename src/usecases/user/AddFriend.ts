import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class AddFriend {
    constructor(private readonly repo: IUserRepository) {}

    async execute(input: {userId: string, friendId: string}) {
        const { userId, friendId } = input;
        await this.repo.addNewFriend(userId, friendId);
    }
}