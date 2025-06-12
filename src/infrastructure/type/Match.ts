import { CatStatus } from "../../domain/valueObjects/CatStatus.ts"

export type MatchPayload = {
    slot: {playerId: string}[],
    catStatus: CatStatus[],
    status: string,
}