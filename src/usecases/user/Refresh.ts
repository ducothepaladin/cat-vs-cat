import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class Refresh {
    constructor(private readonly repo: IUserRepository){}

    async execute(input: {refreshToken: string}) {

        const {refreshToken} = input;
        const tokens = await this.repo.refresh(refreshToken);

        return {tokens}

    }
}