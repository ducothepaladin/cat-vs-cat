import { Match } from "domain/entities/Match";


export interface IMatchRepository {
    findMatchById(id: string): Promise<Match | null>,
    createRoom(match: Match): Promise<Match | null>,
    updateStatus(id: string, status: string): Promise<void>
}