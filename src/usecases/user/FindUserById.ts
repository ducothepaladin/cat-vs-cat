import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class FindUserById {
    constructor(private readonly repo: IUserRepository) {}

    async execute(input: {id: string}) {
        const {id} = input;
        const user = await this.repo.getUserById(id);

        return {user};
    }
}