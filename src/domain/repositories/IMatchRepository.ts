import { Match } from "domain/entities/Match";


export interface IMatchRepository {
    findMatchById(id: string): Promise<Match | null>,
    createRoom(match: Match): Promise<Match | null>,
    updatePosition(matchId: string, p1Position: { x: number; y: number },
    p2Position: { x: number; y: number }): Promise<Match | null>
}