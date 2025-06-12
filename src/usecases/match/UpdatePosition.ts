import { IMatchRepository } from "domain/repositories/IMatchRepository";

export class UpdatePosition {
    constructor(private readonly repo: IMatchRepository){}

    async execute(input: {matchId: string, p1Position: {x: number, y: number}, p2Position: {x: number, y: number}}) {

        const { matchId, p1Position, p2Position } = input;

        const match = await this.repo.updatePosition(matchId, p1Position, p2Position);

        return { p1Position: match?.catStatus[0].position , p2Position: match?.catStatus[1].position }
    }
}