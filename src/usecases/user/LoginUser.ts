import { IUserRepository } from "domain/repositories/IUserRepository";

export class LoginUser {
    constructor(private readonly repo: IUserRepository) {}

    async execute(input: {email: string, password: string}) {
        const { email, password } = input;

        const tokens = await this.repo.login(email, password);
        return { tokens }
    }
}