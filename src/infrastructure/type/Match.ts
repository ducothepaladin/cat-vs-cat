import { CatStatus } from "../../domain/valueObjects/CatStatus.ts"

export type MatchPayload = {
    slot: {playerId: string}[],
    status: string,
}

export type Position = {
    x: number;
    y: number;
}

export type Velocity = {
    x: number,
    y: number
}


export type PlayerData = {
    position: Position;
    velocity: Velocity;
    health: number;
}

export type PlayerInput = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    attack: boolean;
}