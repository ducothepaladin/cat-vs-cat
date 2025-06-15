import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class AddFriend {
    constructor(private readonly repo: IUserRepository) {}

    async execute(input: {userId: string, friendEmail: string}) {
        const { userId, friendEmail } = input;
        await this.repo.addNewFriend(userId, friendEmail);
    }
}