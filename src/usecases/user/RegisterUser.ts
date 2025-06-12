import { IUserRepository } from "../../domain/repositories/IUserRepository";



export class RegisterUser {
    constructor(private readonly repo: IUserRepository ) {}

    async execute(input: {name: string, email: string, password: string}) {
        const {name, email, password} = input;

        await this.repo.register(name, email, password);
    }
}