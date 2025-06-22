import { CatStatus } from "../../domain/valueObjects/CatStatus.ts";
import { MatchRepository } from "../../infrastructure/repositories/MatchRepository.ts";

export class StartMatch {
    constructor(private readonly repo:MatchRepository ){}


    async execute(input: {p1: string, p2: string}) {

        const {p1, p2} = input;

        const catStatus1 = CatStatus.init(100, 100);
        const catStatus2 = CatStatus.init(500, 500);

        const payload = {
            slot: [{playerId: p1}, {playerId: p2}],
            catStatus: [catStatus1, catStatus2],
            status: "start",
        }

        const match = await this.repo.createRoom(payload);
        
        
        return { match };
    }
}