import { IMatchRepository } from "../../domain/repositories/IMatchRepository";

export class UpdateStatus {
    constructor(private readonly repo: IMatchRepository) {}

    async execute(input: {id: string, status: string}) {

        const { id, status} = input;


        await this.repo.updateStatus(id, status);

    }
}